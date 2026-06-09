package com.shabuyaki.repository;

import com.shabuyaki.entity.Category;
import com.shabuyaki.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    @Query("SELECT m FROM MenuItem m JOIN FETCH m.category WHERE m.isActive = true ORDER BY m.category.displayOrder, m.name")
    List<MenuItem> findAllActiveWithCategory();

    @Query("SELECT m FROM MenuItem m JOIN FETCH m.category ORDER BY m.category.displayOrder, m.name")
    List<MenuItem> findAllWithCategory();
}
