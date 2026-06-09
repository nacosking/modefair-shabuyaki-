package com.shabuyaki.service;

import com.shabuyaki.config.RestaurantProperties;
import com.shabuyaki.dto.request.LoginRequest;
import com.shabuyaki.dto.response.AuthResponse;
import com.shabuyaki.entity.AdminUser;
import com.shabuyaki.entity.RefreshToken;
import com.shabuyaki.exception.UnauthorizedException;
import com.shabuyaki.repository.AdminUserRepository;
import com.shabuyaki.repository.RefreshTokenRepository;
import com.shabuyaki.security.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String REFRESH_COOKIE_NAME = "refresh_token";

    private final AdminUserRepository adminUserRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.jwt.refresh-token-expiry-days}")
    private int refreshTokenExpiryDays;

    @Value("${app.cookie.secure}")
    private boolean cookieSecure;

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        AdminUser user = adminUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        // Generate tokens
        String accessToken  = jwtTokenProvider.generateAccessToken(user.getUsername());
        String refreshToken = issueRefreshToken(user, response);

        log.info("Admin '{}' logged in successfully", user.getUsername());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiryMs() / 1000)
                .username(user.getUsername())
                .build();
    }

    @Transactional
    public AuthResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        String rawToken = extractRefreshTokenFromCookie(request);
        if (rawToken == null) {
            throw new UnauthorizedException("Refresh token not found");
        }

        String tokenHash = hashToken(rawToken);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (storedToken.isExpired()) {
            refreshTokenRepository.delete(storedToken);
            throw new UnauthorizedException("Refresh token has expired — please log in again");
        }

        AdminUser user = storedToken.getAdminUser();

        // Rotate: delete old, issue new
        refreshTokenRepository.delete(storedToken);
        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getUsername());
        issueRefreshToken(user, response);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiryMs() / 1000)
                .username(user.getUsername())
                .build();
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String rawToken = extractRefreshTokenFromCookie(request);
        if (rawToken != null) {
            String tokenHash = hashToken(rawToken);
            refreshTokenRepository.findByTokenHash(tokenHash)
                    .ifPresent(refreshTokenRepository::delete);
        }
        clearRefreshCookie(response);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String issueRefreshToken(AdminUser user, HttpServletResponse response) {
        String rawToken  = UUID.randomUUID().toString();
        String tokenHash = hashToken(rawToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .adminUser(user)
                .tokenHash(tokenHash)
                .expiresAt(LocalDateTime.now().plusDays(refreshTokenExpiryDays))
                .build();
        refreshTokenRepository.save(refreshToken);

        // Set as HttpOnly cookie
        Cookie cookie = new Cookie(REFRESH_COOKIE_NAME, rawToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/api/auth");
        cookie.setMaxAge(refreshTokenExpiryDays * 24 * 60 * 60);
        response.addCookie(cookie);

        return rawToken;
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> REFRESH_COOKIE_NAME.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(REFRESH_COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/api/auth");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
