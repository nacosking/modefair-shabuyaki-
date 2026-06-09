package com.shabuyaki.controller;

import com.shabuyaki.dto.request.CategoryRequest;
import com.shabuyaki.dto.request.MenuItemRequest;
import com.shabuyaki.dto.response.ApiResponse;
import com.shabuyaki.dto.response.CategoryResponse;
import com.shabuyaki.dto.response.MenuItemResponse;
import com.shabuyaki.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminMenuController {

    private final MenuService menuService;

    // ── Menu Items ────────────────────────────────────────────────────────────

    /** GET /api/admin/menu — all items including inactive */
    @GetMapping("/menu")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getAllItems() {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getAllMenuItems()));
    }

    /** GET /api/admin/menu/{id} */
    @GetMapping("/menu/{id}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getItem(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getMenuItemById(id)));
    }

    /** POST /api/admin/menu */
    @PostMapping("/menu")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createItem(
            @Valid @RequestBody MenuItemRequest request) {
        MenuItemResponse created = menuService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Menu item created", created));
    }

    /** PUT /api/admin/menu/{id} */
    @PutMapping("/menu/{id}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Menu item updated", menuService.updateMenuItem(id, request)));
    }

    /**
     * DELETE /api/admin/menu/{id}
     * Soft delete — sets is_active = false.
     * Hard delete is intentionally not exposed to protect historical receipt data.
     */
    @DeleteMapping("/menu/{id}")
    public ResponseEntity<ApiResponse<Void>> softDeleteItem(@PathVariable Long id) {
        menuService.softDeleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.ok("Menu item deactivated", null));
    }

    /** PUT /api/admin/menu/{id}/restore — re-activates a soft-deleted item */
    @PutMapping("/menu/{id}/restore")
    public ResponseEntity<ApiResponse<MenuItemResponse>> restoreItem(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Menu item restored", menuService.restoreMenuItem(id)));
    }

    // ── Categories ────────────────────────────────────────────────────────────

    /** GET /api/admin/categories */
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getAllCategories()));
    }

    /** POST /api/admin/categories */
    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse created = menuService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Category created", created));
    }

    /** PUT /api/admin/categories/{id} */
    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Category updated", menuService.updateCategory(id, request)));
    }
}
