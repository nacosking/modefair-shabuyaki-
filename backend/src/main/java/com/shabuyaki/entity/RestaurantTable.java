package com.shabuyaki.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tables")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RestaurantTable extends BaseEntity {

    public enum TableStatus {
        open, occupied, dirty
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "table_number", nullable = false, unique = true)
    private Integer tableNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    @Builder.Default
    private TableStatus status = TableStatus.open;
}
