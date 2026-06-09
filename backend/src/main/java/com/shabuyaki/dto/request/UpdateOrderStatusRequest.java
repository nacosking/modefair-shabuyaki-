package com.shabuyaki.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotBlank
    @Pattern(regexp = "paid|voided")
    private String status;
}
