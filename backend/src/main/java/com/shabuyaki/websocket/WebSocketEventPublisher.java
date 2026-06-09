package com.shabuyaki.websocket;

import com.shabuyaki.dto.response.OrderItemResponse;
import com.shabuyaki.dto.response.TableResponse;
import com.shabuyaki.entity.OrderItem;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    // ── Topics ────────────────────────────────────────────────────────────────
    public static final String TOPIC_TABLES      = "/topic/tables";
    public static final String TOPIC_KITCHEN     = "/topic/kitchen";
    public static final String TOPIC_BAR         = "/topic/bar";
    public static final String TOPIC_PREP_STATUS = "/topic/prep-status";

    // ── Table status changed ──────────────────────────────────────────────────
    public void publishTableStatusChanged(TableResponse table) {
        log.debug("WS → {}: table {} → {}", TOPIC_TABLES, table.getTableNumber(), table.getStatus());
        messagingTemplate.convertAndSend(TOPIC_TABLES, table);
    }

    // ── New kitchen ticket ────────────────────────────────────────────────────
    public void publishKitchenTicket(KitchenBarTicket ticket) {
        log.debug("WS → {}: order {} table {}", TOPIC_KITCHEN, ticket.getReceiptNumber(), ticket.getTableNumber());
        messagingTemplate.convertAndSend(TOPIC_KITCHEN, ticket);
    }

    // ── New bar ticket ────────────────────────────────────────────────────────
    public void publishBarTicket(KitchenBarTicket ticket) {
        log.debug("WS → {}: order {} table {}", TOPIC_BAR, ticket.getReceiptNumber(), ticket.getTableNumber());
        messagingTemplate.convertAndSend(TOPIC_BAR, ticket);
    }

    // ── Prep status update ────────────────────────────────────────────────────
    public void publishPrepStatusUpdate(PrepStatusEvent event) {
        log.debug("WS → {}: item {} → {}", TOPIC_PREP_STATUS, event.getOrderItemId(), event.getPrepStatus());
        messagingTemplate.convertAndSend(TOPIC_PREP_STATUS, event);
    }

    // ── Payload DTOs ──────────────────────────────────────────────────────────

    @Data
    @Builder
    public static class KitchenBarTicket {
        private Long orderId;
        private String receiptNumber;
        private Integer tableNumber;
        private String station;          // "kitchen" or "bar"
        private List<TicketItem> items;
        private BigDecimal stationSubtotal;

        @Data
        @Builder
        public static class TicketItem {
            private Long orderItemId;
            private String itemName;
            private String itemNameJp;
            private Integer quantity;
            private BigDecimal unitPrice;

            public static TicketItem from(OrderItem oi) {
                return TicketItem.builder()
                        .orderItemId(oi.getId())
                        .itemName(oi.getMenuItem().getName())
                        .itemNameJp(oi.getMenuItem().getNameJp())
                        .quantity(oi.getQuantity())
                        .unitPrice(oi.getPriceAtTimeOfOrder())
                        .build();
            }
        }
    }

    @Data
    @Builder
    public static class PrepStatusEvent {
        private Long orderItemId;
        private Long orderId;
        private String receiptNumber;
        private String itemName;
        private String station;
        private String prepStatus;
    }
}
