package com.shabuyaki.controller;

import com.shabuyaki.dto.request.SplitCheckRequest;
import com.shabuyaki.dto.request.UpdateOrderStatusRequest;
import com.shabuyaki.dto.request.UpdatePrepStatusRequest;
import com.shabuyaki.dto.response.ApiResponse;
import com.shabuyaki.dto.response.OrderItemResponse;
import com.shabuyaki.dto.response.OrderResponse;
import com.shabuyaki.dto.response.SplitCheckResponse;
import com.shabuyaki.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    /**
     * GET /api/admin/orders/table/{tableId}
     * Returns the current open order for a given table.
     * Used by the admin when clicking a table on the table map.
     */
    @GetMapping("/orders/table/{tableId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByTable(
            @PathVariable Long tableId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderByTable(tableId)));
    }

    /**
     * GET /api/admin/orders/{id}
     * Returns a specific order by ID with all items.
     */
    @GetMapping("/orders/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderById(id)));
    }

    /**
     * PUT /api/admin/orders/{id}/status
     * Marks an order as paid or voided.
     * Automatically sets the table status to 'dirty' when closed.
     */
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse updated = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated", updated));
    }

    /**
     * PUT /api/admin/order-items/{id}/prep-status
     * Advances an individual item through: pending → preparing → served.
     * Broadcasts the change via WebSocket so kitchen/bar screens update instantly.
     */
    @PutMapping("/order-items/{id}/prep-status")
    public ResponseEntity<ApiResponse<OrderItemResponse>> updatePrepStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePrepStatusRequest request) {
        OrderItemResponse updated = orderService.updatePrepStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Prep status updated", updated));
    }

    /**
     * POST /api/admin/orders/{id}/split
     * Splits an order check.
     * splitType=evenly  → divides total by guestCount
     * splitType=by_item → assigns specific orderItemIds to guest 1, rest to guest 2
     */
    @PostMapping("/orders/{id}/split")
    public ResponseEntity<ApiResponse<SplitCheckResponse>> splitCheck(
            @PathVariable Long id,
            @Valid @RequestBody SplitCheckRequest request) {
        SplitCheckResponse split = orderService.splitCheck(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Check split calculated", split));
    }
}
