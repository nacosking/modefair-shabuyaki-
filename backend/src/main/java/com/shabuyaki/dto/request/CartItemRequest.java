package com.shabuyaki.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull
    private Long menuItemId;

    @NotNull
    @Min(value = 1)
    @Max(value = 50)
    private Integer quantity;
}
