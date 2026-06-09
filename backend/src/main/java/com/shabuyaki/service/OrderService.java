package com.shabuyaki.service;

import com.shabuyaki.config.RestaurantProperties;
import com.shabuyaki.dto.request.CheckoutRequest;
import com.shabuyaki.dto.request.SplitCheckRequest;
import com.shabuyaki.dto.request.UpdateOrderStatusRequest;
import com.shabuyaki.dto.request.UpdatePrepStatusRequest;
import com.shabuyaki.dto.response.OrderItemResponse;
import com.shabuyaki.dto.response.OrderResponse;
import com.shabuyaki.dto.response.SplitCheckResponse;
import com.shabuyaki.entity.*;
import com.shabuyaki.exception.BadRequestException;
import com.shabuyaki.exception.BusinessRuleException;
import com.shabuyaki.exception.ResourceNotFoundException;
import com.shabuyaki.repository.*;
import com.shabuyaki.websocket.WebSocketEventPublisher;
import com.shabuyaki.websocket.WebSocketEventPublisher.KitchenBarTicket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    // Supported discount codes — move to DB table for production
    private static final Map<String, DiscountRule> DISCOUNT_RULES = Map.of(
            "WELCOME10", new DiscountRule("percent", BigDecimal.valueOf(10)),
            "OMAKASE20", new DiscountRule("percent", BigDecimal.valueOf(20)),
            "FLAT15",    new DiscountRule("flat",    BigDecimal.valueOf(15))
    );

    private final OrderRepository          orderRepository;
    private final OrderItemRepository      orderItemRepository;
    private final MenuItemRepository       menuItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final WebSocketEventPublisher  eventPublisher;
    private final RestaurantProperties     restaurantProperties;

    // ── Public: Checkout ─────────────────────────────────────────────────────

    /**
     * Core checkout flow:
     * 1. Validate table exists
     * 2. Look up each menu item from DB (never trust client prices)
     * 3. Apply discount server-side
     * 4. Generate receipt number atomically within transaction
     * 5. Persist Order + OrderItems
     * 6. Mark table as occupied
     * 7. Route items to kitchen/bar via WebSocket
     */
    @Transactional
    public OrderResponse checkout(CheckoutRequest request) {
        // 1 — Validate table
        RestaurantTable table = tableRepository.findByTableNumber(request.getTableNumber())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Table " + request.getTableNumber() + " not found"));

        // 2 — Fetch and validate menu items, build order items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CheckoutRequest.CartItemRequest cartItem : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(cartItem.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Menu item not found: " + cartItem.getMenuItemId()));

            if (!menuItem.getIsActive()) {
                throw new BadRequestException(
                        "Menu item '" + menuItem.getName() + "' is no longer available");
            }

            // Price snapshot — copied from DB at this exact moment
            orderItems.add(OrderItem.builder()
                    .menuItem(menuItem)
                    .quantity(cartItem.getQuantity())
                    .priceAtTimeOfOrder(menuItem.getPrice()) // ← critical snapshot
                    .prepStatus(OrderItem.PrepStatus.pending)
                    .build());
        }

        // 3 — Server-side totals calculation
        BigDecimal subtotal = orderItems.stream()
                .map(OrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discountAmount = BigDecimal.ZERO;
        String discountCode = null;

        if (request.getDiscountCode() != null && !request.getDiscountCode().isBlank()) {
            String code = request.getDiscountCode().toUpperCase().trim();
            DiscountRule rule = DISCOUNT_RULES.get(code);
            if (rule == null) {
                throw new BadRequestException("Invalid discount code: " + code);
            }
            discountAmount = rule.calculate(subtotal);
            discountCode   = code;
        }

        BigDecimal totalAmount = subtotal.subtract(discountAmount).max(BigDecimal.ZERO);

        // 4 — Generate human-readable receipt number (atomic within transaction)
        String receiptNumber = generateReceiptNumber();

        // 5 — Persist Order
        Order order = Order.builder()
                .table(table)
                .receiptNumber(receiptNumber)
                .status(Order.OrderStatus.open)
                .discountCode(discountCode)
                .discountAmount(discountAmount)
                .subtotal(subtotal)
                .totalAmount(totalAmount)
                .build();

        Order savedOrder = orderRepository.save(order);

        // Attach order reference to each item and save
        orderItems.forEach(oi -> oi.setOrder(savedOrder));
        List<OrderItem> savedItems = orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItems(savedItems);

        // 6 — Mark table occupied
        table.setStatus(RestaurantTable.TableStatus.occupied);
        tableRepository.save(table);
        // Broadcast table status change to admin dashboard
        eventPublisher.publishTableStatusChanged(
                com.shabuyaki.dto.response.TableResponse.from(table));

        // 7 — Route tickets to kitchen and/or bar via WebSocket
        routeTickets(savedOrder, savedItems);

        log.info("Checkout complete: receipt={}, table={}, total={}",
                receiptNumber, request.getTableNumber(), totalAmount);

        // Build response with restaurant info for receipt popup
        OrderResponse response = OrderResponse.from(savedOrder);
        response.setRestaurantName(restaurantProperties.getName());
        response.setRestaurantAddress(restaurantProperties.getAddress());
        response.setRestaurantPhone(restaurantProperties.getPhone());
        return response;
    }

    // ── Admin: Get order for table ────────────────────────────────────────────

    @Transactional(readOnly = true)
    public OrderResponse getOrderByTable(Long tableId) {
        Order order = orderRepository.findOpenOrderByTableId(tableId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No open order found for table id: " + tableId));

        return OrderResponse.from(orderRepository.findByIdWithItems(order.getId())
                .orElse(order));
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        return OrderResponse.from(order);
    }

    // ── Admin: Update order status ────────────────────────────────────────────

    @Transactional
    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));

        if (order.getStatus() != Order.OrderStatus.open) {
            throw new BusinessRuleException("Only open orders can be updated. Current status: " + order.getStatus());
        }

        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(request.getStatus());
        order.setStatus(newStatus);

        // Free up the table when order is paid or voided
        if (newStatus == Order.OrderStatus.paid || newStatus == Order.OrderStatus.voided) {
            RestaurantTable table = order.getTable();
            table.setStatus(RestaurantTable.TableStatus.dirty);
            tableRepository.save(table);
            eventPublisher.publishTableStatusChanged(
                    com.shabuyaki.dto.response.TableResponse.from(table));
        }

        Order saved = orderRepository.save(order);
        log.info("Order {} status → {}", saved.getReceiptNumber(), newStatus);
        return OrderResponse.from(saved);
    }

    // ── Admin: Update individual item prep status ─────────────────────────────

    @Transactional
    public OrderItemResponse updatePrepStatus(Long orderItemId, UpdatePrepStatusRequest request) {
        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found: " + orderItemId));

        OrderItem.PrepStatus newStatus = OrderItem.PrepStatus.valueOf(request.getPrepStatus());
        validatePrepStatusTransition(item.getPrepStatus(), newStatus);

        item.setPrepStatus(newStatus);
        OrderItem saved = orderItemRepository.save(item);

        // Broadcast prep status change to all admin clients
        eventPublisher.publishPrepStatusUpdate(
                WebSocketEventPublisher.PrepStatusEvent.builder()
                        .orderItemId(saved.getId())
                        .orderId(saved.getOrder().getId())
                        .receiptNumber(saved.getOrder().getReceiptNumber())
                        .itemName(saved.getMenuItem().getName())
                        .station(saved.getMenuItem().getRoutingStation().name())
                        .prepStatus(newStatus.name())
                        .build()
        );

        log.info("Order item {} prep status → {}", orderItemId, newStatus);
        return OrderItemResponse.from(saved);
    }

    // ── Admin: Split check ────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public SplitCheckResponse splitCheck(Long orderId, SplitCheckRequest request) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        if (order.getStatus() != Order.OrderStatus.open) {
            throw new BusinessRuleException("Can only split open orders");
        }

        return "evenly".equals(request.getSplitType())
                ? splitEvenly(order, request.getGuestCount())
                : splitByItem(order, request.getItemIdsForFirstGuest());
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Generates receipt number: SBY-YYYYMMDD-XXXX
     * Counts today's orders and increments to guarantee uniqueness.
     * Must be called within an existing transaction.
     */
    private String generateReceiptNumber() {
        LocalDateTime now       = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay   = startOfDay.plusDays(1);

        long todayCount = orderRepository.countOrdersBetween(startOfDay, endOfDay);
        String datePart = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String seqPart  = String.format("%04d", todayCount + 1);

        return restaurantProperties.getReceiptPrefix() + "-" + datePart + "-" + seqPart;
    }

    /**
     * Groups order items by routing station and fires WebSocket events
     * so kitchen and bar screens receive only their relevant tickets.
     */
    private void routeTickets(Order order, List<OrderItem> items) {
        Map<MenuItem.RoutingStation, List<OrderItem>> grouped = items.stream()
                .collect(Collectors.groupingBy(oi -> oi.getMenuItem().getRoutingStation()));

        grouped.forEach((station, stationItems) -> {
            List<KitchenBarTicket.TicketItem> ticketItems = stationItems.stream()
                    .map(KitchenBarTicket.TicketItem::from)
                    .collect(Collectors.toList());

            BigDecimal stationSubtotal = stationItems.stream()
                    .map(OrderItem::getLineTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            KitchenBarTicket ticket = KitchenBarTicket.builder()
                    .orderId(order.getId())
                    .receiptNumber(order.getReceiptNumber())
                    .tableNumber(order.getTable().getTableNumber())
                    .station(station.name())
                    .items(ticketItems)
                    .stationSubtotal(stationSubtotal)
                    .build();

            if (station == MenuItem.RoutingStation.kitchen) {
                eventPublisher.publishKitchenTicket(ticket);
            } else {
                eventPublisher.publishBarTicket(ticket);
            }
        });
    }

    private SplitCheckResponse splitEvenly(Order order, int guestCount) {
        BigDecimal perGuest = order.getTotalAmount()
                .divide(BigDecimal.valueOf(guestCount), 2, RoundingMode.CEILING);

        List<SplitCheckResponse.GuestCheck> checks = new ArrayList<>();
        for (int i = 1; i <= guestCount; i++) {
            checks.add(SplitCheckResponse.GuestCheck.builder()
                    .guestNumber(i)
                    .amount(perGuest)
                    .items(Collections.emptyList()) // Even split doesn't assign specific items
                    .build());
        }

        return SplitCheckResponse.builder()
                .splitType("evenly")
                .guestCount(guestCount)
                .guestChecks(checks)
                .build();
    }

    private SplitCheckResponse splitByItem(Order order, List<Long> firstGuestItemIds) {
        if (firstGuestItemIds == null || firstGuestItemIds.isEmpty()) {
            throw new BadRequestException("Item IDs for first guest are required for by-item split");
        }

        List<OrderItem> allItems = order.getOrderItems();
        Set<Long> firstGuestSet  = new HashSet<>(firstGuestItemIds);

        List<OrderItem> guestAItems = allItems.stream()
                .filter(oi -> firstGuestSet.contains(oi.getId()))
                .collect(Collectors.toList());

        List<OrderItem> guestBItems = allItems.stream()
                .filter(oi -> !firstGuestSet.contains(oi.getId()))
                .collect(Collectors.toList());

        if (guestAItems.isEmpty()) {
            throw new BadRequestException("No valid order items found for first guest");
        }

        BigDecimal guestATotal = guestAItems.stream().map(OrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal guestBTotal = guestBItems.stream().map(OrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return SplitCheckResponse.builder()
                .splitType("by_item")
                .guestCount(2)
                .guestChecks(List.of(
                        SplitCheckResponse.GuestCheck.builder()
                                .guestNumber(1)
                                .amount(guestATotal)
                                .items(guestAItems.stream().map(OrderItemResponse::from).collect(Collectors.toList()))
                                .build(),
                        SplitCheckResponse.GuestCheck.builder()
                                .guestNumber(2)
                                .amount(guestBTotal)
                                .items(guestBItems.stream().map(OrderItemResponse::from).collect(Collectors.toList()))
                                .build()
                ))
                .build();
    }

    private void validatePrepStatusTransition(OrderItem.PrepStatus current, OrderItem.PrepStatus next) {
        // Enforce forward-only state machine: pending → preparing → served
        boolean valid = switch (current) {
            case pending    -> next == OrderItem.PrepStatus.preparing;
            case preparing  -> next == OrderItem.PrepStatus.served;
            case served     -> false; // Terminal state
        };
        if (!valid) {
            throw new BusinessRuleException(
                    "Invalid prep status transition: " + current + " → " + next);
        }
    }

    // ── Inner: Discount rule ──────────────────────────────────────────────────
    private record DiscountRule(String type, BigDecimal value) {
        BigDecimal calculate(BigDecimal subtotal) {
            return switch (type) {
                case "percent" -> subtotal.multiply(value).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                case "flat"    -> value.min(subtotal);
                default        -> BigDecimal.ZERO;
            };
        }
    }
}
