package com.farmxchain.backend.controller;

import com.farmxchain.backend.dto.*;
import com.farmxchain.backend.model.User;
import com.farmxchain.backend.repository.UserRepository;
import com.farmxchain.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.farmxchain.backend.service.FarmerService farmerService;

    // -------------------------------
    // Register User
    // -------------------------------
    @PostMapping("/register")
    public org.springframework.http.ResponseEntity<GenericResponse> register(@RequestBody RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            return org.springframework.http.ResponseEntity.ok(new GenericResponse(false, "Email already exists!"));
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt
        user.setRole(request.getRole());
        user.setEnabled(true); // Allow login to see approval status
        User savedUser = userRepo.save(user);

        // Auto-initialize Farmer Profile if role is FARMER
        if (request.getRole() == com.farmxchain.backend.model.Role.FARMER) {
            com.farmxchain.backend.model.Farmer farmer = new com.farmxchain.backend.model.Farmer();
            farmer.setFarmName(savedUser.getName() + "'s Farm");
            farmer.setPrimaryCrop("General Agriculture");
            farmerService.createFarmer(farmer, savedUser);
        }

        return org.springframework.http.ResponseEntity.ok(new GenericResponse(true, "User registered successfully!"));
    }

    // -------------------------------
    // Login User
    // -------------------------------
    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return org.springframework.http.ResponseEntity.status(401).body(new GenericResponse(false, "Incorrect email or password"));
        }

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getName(), user.getRole().name());
        return org.springframework.http.ResponseEntity.ok(new AuthResponse(true, token, user.getId(), user.getName(), user.getEmail(), user.getRole().name()));
    }
}