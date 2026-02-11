package com.farmxchain.backend.dto;

public class AuthResponse {
    private boolean success;
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;

    public AuthResponse(boolean success, String token, Long userId, String name, String email, String role) {
        this.success = success;
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public boolean isSuccess() { return success; }
    public String getToken() { return token; }
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}