package com.farmxchain.backend.controller;

import com.farmxchain.backend.dto.DisputeRequest;
import com.farmxchain.backend.dto.DisputeResponse;
import com.farmxchain.backend.security.JwtUtil;
import com.farmxchain.backend.service.DisputeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disputes")
public class DisputeController {

    @Autowired
    private DisputeService disputeService;

    @Autowired
    private JwtUtil jwtUtil;

    // Create a new dispute
    @PostMapping
    public ResponseEntity<?> createDispute(@RequestBody DisputeRequest request, HttpServletRequest httpRequest) {
        try {
            String token = httpRequest.getHeader("Authorization").substring(7);
            Long userId = jwtUtil.extractUserId(token);
            
            DisputeResponse response = disputeService.createDispute(request, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all disputes (Admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllDisputes() {
        try {
            List<DisputeResponse> disputes = disputeService.getAllDisputes();
            return ResponseEntity.ok(disputes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get disputes by status (Admin only)
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDisputesByStatus(@PathVariable String status) {
        try {
            List<DisputeResponse> disputes = disputeService.getDisputesByStatus(status);
            return ResponseEntity.ok(disputes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get current user's disputes
    @GetMapping("/my")
    public ResponseEntity<?> getMyDisputes(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long userId = jwtUtil.extractUserId(token);
            
            List<DisputeResponse> disputes = disputeService.getMyDisputes(userId);
            return ResponseEntity.ok(disputes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get dispute by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDisputeById(@PathVariable Long id) {
        try {
            DisputeResponse dispute = disputeService.getDisputeById(id);
            return ResponseEntity.ok(dispute);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Resolve dispute (Admin only)
    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resolveDispute(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long adminId = jwtUtil.extractUserId(token);
            
            String resolution = body.get("resolution");
            DisputeResponse response = disputeService.resolveDispute(id, resolution, adminId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update dispute status (Admin only)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDisputeStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            DisputeResponse response = disputeService.updateDisputeStatus(id, status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
