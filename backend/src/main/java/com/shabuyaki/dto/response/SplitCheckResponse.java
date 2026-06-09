package com.shabuyaki.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class SplitCheckResponse {
    private String splitType;
    private Integer guestCount;
    private List<GuestCheck> guestChecks;

    @Data
    @Builder
    public static class GuestCheck {
        private Integer guestNumber;
        private BigDecimal amount;
        private List<OrderItemResponse> items;
    }
}
