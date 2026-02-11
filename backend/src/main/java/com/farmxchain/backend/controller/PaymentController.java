package com.farmxchain.backend.controller;

import com.farmxchain.backend.model.Payment;
import com.farmxchain.backend.service.PaymentService;
import com.farmxchain.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/pay")
    @PreAuthorize("hasAnyRole('DISTRIBUTOR', 'RETAILER', 'CONSUMER')")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        try {
            Long orderId = Long.valueOf(payload.get("orderId").toString());
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());
            String paymentMethod = payload.get("paymentMethod") != null ? payload.get("paymentMethod").toString() : "UPI";
            
            Payment payment = paymentService.processPayment(orderId, paymentMethod, amount);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER', 'CONSUMER', 'ADMIN')")
    public ResponseEntity<?> getPaymentByOrder(@PathVariable Long orderId) {
        try {
            Payment payment = paymentService.getPaymentByOrderId(orderId);
            if (payment == null) {
                return ResponseEntity.ok(Map.of("status", "UNPAID"));
            }
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
