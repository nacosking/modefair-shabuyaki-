package com.shabuyaki.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem extends BaseEntity {

    public enum PrepStatus {
        pending, preparing, served
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    // Price snapshot — never changes even if menu price is updated
    @Column(name = "price_at_time_of_order", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtTimeOfOrder;

    @Enumerated(EnumType.STRING)
    @Column(name = "prep_status", nullable = false, length = 12)
    @Builder.Default
    private PrepStatus prepStatus = PrepStatus.pending;

    public BigDecimal getLineTotal() {
        return priceAtTimeOfOrder.multiply(BigDecimal.valueOf(quantity));
    }
}
