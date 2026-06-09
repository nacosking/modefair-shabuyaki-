package com.shabuyaki.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class SplitCheckRequest {
    @NotBlank
    @Pattern(regexp = "by_item|evenly")
    private String splitType;

    @Min(value = 2)
    @Max(value = 20)
    private Integer guestCount;

    private List<Long> itemIdsForFirstGuest;
}
