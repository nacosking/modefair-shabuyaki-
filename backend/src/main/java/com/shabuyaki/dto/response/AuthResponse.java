package com.shabuyaki.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
@Data @Builder @AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType;
    private long expiresIn;
    private String username;
}
