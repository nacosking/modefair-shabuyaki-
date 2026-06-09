package com.shabuyaki.dto.response;

import com.shabuyaki.entity.MenuItem;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class MenuItemResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categoryNameJp;
    private String name;
    private String nameJp;
    private String description;
    private BigDecimal price;
    private String routingStation;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MenuItemResponse from(MenuItem item) {
        return MenuItemResponse.builder()
                .id(item.getId())
                .categoryId(item.getCategory().getId())
                .categoryName(item.getCategory().getName())
                .categoryNameJp(item.getCategory().getNameJp())
                .name(item.getName())
                .nameJp(item.getNameJp())
                .description(item.getDescription())
                .price(item.getPrice())
                .routingStation(item.getRoutingStation().name())
                .isActive(item.getIsActive())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
