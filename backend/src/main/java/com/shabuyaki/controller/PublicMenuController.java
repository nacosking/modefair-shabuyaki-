package com.shabuyaki.controller;

import com.shabuyaki.dto.response.ApiResponse;
import com.shabuyaki.dto.response.CategoryResponse;
import com.shabuyaki.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class PublicMenuController {

    private final MenuService menuService;

    /**
     * GET /api/menu
     * Public — no auth required.
     * Returns all active menu items grouped by category, ordered by display_order.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getMenu() {
        List<CategoryResponse> menu = menuService.getPublicMenu();
        return ResponseEntity.ok(ApiResponse.ok(menu));
    }
}
