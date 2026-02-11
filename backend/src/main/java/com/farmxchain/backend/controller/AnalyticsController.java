package com.farmxchain.backend.controller;

import com.farmxchain.backend.service.AnalyticsService;
import com.farmxchain.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private JwtUtil jwtUtil;

    // --- Public Traceability ---
    @GetMapping("/public/trace/{cropId}")
    public ResponseEntity<?> traceCrop(@PathVariable Long cropId) {
        try {
            Map<String, Object> data = analyticsService.getCropJourney(cropId);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Farmer Analytics ---
    @GetMapping("/analytics/farmer")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    public ResponseEntity<?> getFarmerAnalytics(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long farmerId = jwtUtil.extractUserId(token);
            
            return ResponseEntity.ok(analyticsService.getFarmerAnalytics(farmerId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- System Analytics (Admin) ---
    @GetMapping("/analytics/system")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSystemAnalytics() {
        try {
            return ResponseEntity.ok(analyticsService.getSystemAnalytics());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Demand Trends ---
    @GetMapping("/analytics/demand-trends")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDemandTrends() {
        try {
            return ResponseEntity.ok(analyticsService.getDemandTrends());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Pricing Trends ---
    @GetMapping("/analytics/pricing-trends")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPricingTrends() {
        try {
            return ResponseEntity.ok(analyticsService.getPricingTrends());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Supply Chain Metrics ---
    @GetMapping("/analytics/supply-chain")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSupplyChainMetrics() {
        try {
            return ResponseEntity.ok(analyticsService.getSupplyChainMetrics());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Distributor Analytics ---
    @GetMapping("/analytics/distributor")
    @PreAuthorize("hasAnyRole('DISTRIBUTOR', 'ADMIN')")
    public ResponseEntity<?> getDistributorAnalytics(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long distributorId = jwtUtil.extractUserId(token);
            
            return ResponseEntity.ok(analyticsService.getDistributorAnalytics(distributorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Retailer Analytics ---
    @GetMapping("/analytics/retailer")
    @PreAuthorize("hasAnyRole('RETAILER', 'ADMIN')")
    public ResponseEntity<?> getRetailerAnalytics(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long retailerId = jwtUtil.extractUserId(token);
            
            return ResponseEntity.ok(analyticsService.getRetailerAnalytics(retailerId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

