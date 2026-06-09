package com.shabuyaki.dto.response;

import com.shabuyaki.entity.Category;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String nameJp;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MenuItemResponse> items;

    public static CategoryResponse from(Category cat) {
        return CategoryResponse.builder()
                .id(cat.getId())
                .name(cat.getName())
                .nameJp(cat.getNameJp())
                .displayOrder(cat.getDisplayOrder())
                .createdAt(cat.getCreatedAt())
                .updatedAt(cat.getUpdatedAt())
                .build();
    }
}
