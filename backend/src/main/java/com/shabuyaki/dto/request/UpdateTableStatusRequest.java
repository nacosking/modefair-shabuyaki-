package com.shabuyaki.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateTableStatusRequest {
    @NotBlank
    @Pattern(regexp = "open|occupied|dirty")
    private String status;
}
