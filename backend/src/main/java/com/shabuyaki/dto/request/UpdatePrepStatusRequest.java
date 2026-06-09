package com.shabuyaki.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdatePrepStatusRequest {
    @NotBlank
    @Pattern(regexp = "pending|preparing|served")
    private String prepStatus;
}
