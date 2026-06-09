package com.shabuyaki.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "Category name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Japanese name is required")
    @Size(max = 100)
    private String nameJp;

    @NotNull
    @Min(0)
    private Integer displayOrder;
}
