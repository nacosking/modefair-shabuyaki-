package com.shabuyaki.dto.response;

import com.shabuyaki.entity.Order;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private Long tableId;
    private Integer tableNumber;
    private String receiptNumber;
    private String status;
    private String discountCode;
    private BigDecimal discountAmount;
    private BigDecimal subtotal;
    private BigDecimal totalAmount;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Restaurant info included in checkout response for receipt popup
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantPhone;

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .tableId(order.getTable().getId())
                .tableNumber(order.getTable().getTableNumber())
                .receiptNumber(order.getReceiptNumber())
                .status(order.getStatus().name())
                .discountCode(order.getDiscountCode())
                .discountAmount(order.getDiscountAmount())
                .subtotal(order.getSubtotal())
                .totalAmount(order.getTotalAmount())
                .items(order.getOrderItems().stream()
                        .map(OrderItemResponse::from)
                        .collect(Collectors.toList()))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
