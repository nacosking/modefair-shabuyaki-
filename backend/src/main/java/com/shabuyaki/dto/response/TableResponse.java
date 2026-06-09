package com.shabuyaki.dto.response;

import com.shabuyaki.entity.RestaurantTable;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TableResponse {
    private Long id;
    private Integer tableNumber;
    private String status;
    private LocalDateTime updatedAt;

    public static TableResponse from(RestaurantTable t) {
        return TableResponse.builder()
                .id(t.getId())
                .tableNumber(t.getTableNumber())
                .status(t.getStatus().name())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
