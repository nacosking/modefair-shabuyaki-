package com.shabuyaki.service;

import com.shabuyaki.dto.request.CategoryRequest;
import com.shabuyaki.dto.request.MenuItemRequest;
import com.shabuyaki.dto.response.CategoryResponse;
import com.shabuyaki.dto.response.MenuItemResponse;
import com.shabuyaki.entity.Category;
import com.shabuyaki.entity.MenuItem;
import com.shabuyaki.exception.BadRequestException;
import com.shabuyaki.exception.ResourceNotFoundException;
import com.shabuyaki.repository.CategoryRepository;
import com.shabuyaki.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;

    // ── Public ────────────────────────────────────────────────────────────────

    /**
     * Returns all active menu items grouped by category.
     * Used by the customer-facing GET /api/menu endpoint.
     */
    @Transactional(readOnly = true)
    public List<CategoryResponse> getPublicMenu() {
        List<Category> categories = categoryRepository.findAllByOrderByDisplayOrderAsc();
        List<MenuItem> activeItems = menuItemRepository.findAllActiveWithCategory();

        return categories.stream()
                .map(cat -> {
                    List<MenuItemResponse> items = activeItems.stream()
                            .filter(item -> item.getCategory().getId().equals(cat.getId()))
                            .map(MenuItemResponse::from)
                            .collect(Collectors.toList());

                    CategoryResponse response = CategoryResponse.from(cat);
                    response.setItems(items);
                    return response;
                })
                .filter(cat -> !cat.getItems().isEmpty()) // Hide empty categories
                .collect(Collectors.toList());
    }

    // ── Admin — Menu Items ────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getAllMenuItems() {
        return menuItemRepository.findAllWithCategory().stream()
                .map(MenuItemResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return MenuItemResponse.from(item);
    }

    @Transactional
    public MenuItemResponse createMenuItem(MenuItemRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        MenuItem item = MenuItem.builder()
                .category(category)
                .name(request.getName())
                .nameJp(request.getNameJp())
                .description(request.getDescription())
                .price(request.getPrice())
                .routingStation(MenuItem.RoutingStation.valueOf(request.getRoutingStation()))
                .isActive(true)
                .build();

        MenuItem saved = menuItemRepository.save(item);
        log.info("Created menu item: {} (id={})", saved.getName(), saved.getId());
        return MenuItemResponse.from(saved);
    }

    @Transactional
    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        item.setCategory(category);
        item.setName(request.getName());
        item.setNameJp(request.getNameJp());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setRoutingStation(MenuItem.RoutingStation.valueOf(request.getRoutingStation()));

        MenuItem saved = menuItemRepository.save(item);
        log.info("Updated menu item: {} (id={})", saved.getName(), saved.getId());
        return MenuItemResponse.from(saved);
    }

    /**
     * Soft delete — sets is_active = false.
     * Preserves referential integrity with historical OrderItems.
     */
    @Transactional
    public void softDeleteMenuItem(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        if (!item.getIsActive()) {
            throw new BadRequestException("Menu item is already inactive");
        }

        item.setIsActive(false);
        menuItemRepository.save(item);
        log.info("Soft-deleted menu item: {} (id={})", item.getName(), id);
    }

    @Transactional
    public MenuItemResponse restoreMenuItem(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        item.setIsActive(true);
        MenuItem saved = menuItemRepository.save(item);
        log.info("Restored menu item: {} (id={})", saved.getName(), id);
        return MenuItemResponse.from(saved);
    }

    // ── Admin — Categories ────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .nameJp(request.getNameJp())
                .displayOrder(request.getDisplayOrder())
                .build();

        Category saved = categoryRepository.save(category);
        log.info("Created category: {} (id={})", saved.getName(), saved.getId());
        return CategoryResponse.from(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(request.getName());
        category.setNameJp(request.getNameJp());
        category.setDisplayOrder(request.getDisplayOrder());

        Category saved = categoryRepository.save(category);
        return CategoryResponse.from(saved);
    }
}
