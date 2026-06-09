package com.shabuyaki.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequest {
    @NotNull(message = "Table number is required")
    @Min(value = 1)
    private Integer tableNumber;

    @NotEmpty(message = "Cart cannot be empty")
    @Valid
    private List<CartItemRequest> items;

    private String discountCode;
}
