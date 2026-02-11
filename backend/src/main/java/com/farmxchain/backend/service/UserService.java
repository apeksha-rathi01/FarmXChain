package com.farmxchain.backend.service;

import com.farmxchain.backend.model.User;
import com.farmxchain.backend.model.Role;
import com.farmxchain.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // For hashing passwords

    // =====================
    // Register new user
    // =====================
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Optional: default role if not set
        if (user.getRole() == null) {
            user.setRole(Role.CONSUMER);
        }

        return userRepository.save(user);
    }

    // =====================
    // Get all users (Admin)
    // =====================
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // =====================
    // Find user by email
    // =====================
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}
