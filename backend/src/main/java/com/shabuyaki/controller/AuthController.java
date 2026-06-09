package com.shabuyaki.controller;

import com.shabuyaki.dto.request.LoginRequest;
import com.shabuyaki.dto.response.ApiResponse;
import com.shabuyaki.dto.response.AuthResponse;
import com.shabuyaki.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/login
     * Returns JWT in body + refresh token in HttpOnly cookie
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        AuthResponse authResponse = authService.login(request, response);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authResponse));
    }

    /**
     * POST /api/auth/refresh
     * Reads HttpOnly cookie → issues new access token + rotates refresh token
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {

        AuthResponse authResponse = authService.refresh(request, response);
        return ResponseEntity.ok(ApiResponse.ok("Token refreshed", authResponse));
    }

    /**
     * POST /api/auth/logout
     * Invalidates refresh token in DB + clears cookie
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest request,
            HttpServletResponse response) {

        authService.logout(request, response);
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", null));
    }
}
