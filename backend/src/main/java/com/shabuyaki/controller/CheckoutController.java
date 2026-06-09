package com.shabuyaki.controller;

import com.shabuyaki.dto.request.CheckoutRequest;
import com.shabuyaki.dto.response.ApiResponse;
import com.shabuyaki.dto.response.OrderResponse;
import com.shabuyaki.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class CheckoutController {

    private final OrderService orderService;

    /**
     * POST /api/orders/checkout
     * Public — no auth required.
     * Validates the cart, runs server-side pricing and discount logic,
     * creates the order, routes tickets to kitchen/bar via WebSocket,
     * and returns the receipt payload for the frontend popup.
     */
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            @Valid @RequestBody CheckoutRequest request) {

        OrderResponse order = orderService.checkout(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Order placed successfully", order));
    }
}
