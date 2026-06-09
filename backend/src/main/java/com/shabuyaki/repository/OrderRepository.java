package com.shabuyaki.repository;

import com.shabuyaki.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByReceiptNumber(String receiptNumber);

    @Query("SELECT o FROM Order o WHERE o.table.id = :tableId AND o.status = 'open' ORDER BY o.createdAt DESC")
    Optional<Order> findOpenOrderByTableId(@Param("tableId") Long tableId);

    @Query("SELECT o FROM Order o JOIN FETCH o.orderItems oi JOIN FETCH oi.menuItem WHERE o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") Long id);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startOfDay AND o.createdAt < :endOfDay")
    long countOrdersBetween(@Param("startOfDay") LocalDateTime startOfDay,
                            @Param("endOfDay") LocalDateTime endOfDay);

    List<Order> findByTableIdAndStatus(Long tableId, Order.OrderStatus status);
}
