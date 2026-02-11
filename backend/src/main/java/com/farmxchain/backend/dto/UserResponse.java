
package com.farmxchain.backend.dto;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean enabled;

    public UserResponse(Long id, String name, String email, String role, boolean enabled) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.enabled = enabled;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public boolean isEnabled() { return enabled; }
}
