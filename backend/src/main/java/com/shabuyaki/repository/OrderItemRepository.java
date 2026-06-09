package com.shabuyaki.repository;

import com.shabuyaki.entity.MenuItem;
import com.shabuyaki.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderIdOrderByCreatedAtAsc(Long orderId);

    @Query("SELECT oi FROM OrderItem oi JOIN FETCH oi.menuItem WHERE oi.order.id = :orderId AND oi.menuItem.routingStation = :station")
    List<OrderItem> findByOrderIdAndStation(@Param("orderId") Long orderId,
                                            @Param("station") MenuItem.RoutingStation station);
}
