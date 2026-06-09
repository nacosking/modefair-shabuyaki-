package com.shabuyaki.dto.response;

import com.shabuyaki.entity.OrderItem;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class OrderItemResponse {
    private Long id;
    private Long menuItemId;
    private String itemName;
    private String itemNameJp;
    private String routingStation;
    private Integer quantity;
    private BigDecimal priceAtTimeOfOrder;
    private BigDecimal lineTotal;
    private String prepStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static OrderItemResponse from(OrderItem oi) {
        return OrderItemResponse.builder()
                .id(oi.getId())
                .menuItemId(oi.getMenuItem().getId())
                .itemName(oi.getMenuItem().getName())
                .itemNameJp(oi.getMenuItem().getNameJp())
                .routingStation(oi.getMenuItem().getRoutingStation().name())
                .quantity(oi.getQuantity())
                .priceAtTimeOfOrder(oi.getPriceAtTimeOfOrder())
                .lineTotal(oi.getLineTotal())
                .prepStatus(oi.getPrepStatus().name())
                .createdAt(oi.getCreatedAt())
                .updatedAt(oi.getUpdatedAt())
                .build();
    }
}
