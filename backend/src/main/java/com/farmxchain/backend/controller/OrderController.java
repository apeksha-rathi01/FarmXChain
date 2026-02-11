package com.farmxchain.backend.controller;

import com.farmxchain.backend.dto.OrderDTO;
import com.farmxchain.backend.model.Order;
import com.farmxchain.backend.service.OrderService;
import com.farmxchain.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('DISTRIBUTOR', 'RETAILER', 'CONSUMER')")
    public ResponseEntity<?> createOrder(@RequestBody OrderDTO orderDTO, HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long buyerId = jwtUtil.extractUserId(token);
            
            Order order = orderService.createOrder(orderDTO, buyerId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER')")
    public ResponseEntity<?> acceptOrder(@PathVariable Long id, HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long sellerId = jwtUtil.extractUserId(token);
            
            Order order = orderService.acceptOrder(id, sellerId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER')")
    public ResponseEntity<?> rejectOrder(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> body, HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long sellerId = jwtUtil.extractUserId(token);
            
            Order order = orderService.rejectOrder(id, sellerId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/shipped")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER')")
    public ResponseEntity<?> markAsShipped(@PathVariable Long id) {
        try {
            Order order = orderService.markAsShipped(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/delivered") 
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER', 'CONSUMER', 'ADMIN')")
    public ResponseEntity<?> markAsDelivered(@PathVariable Long id) {
        try {
            Order order = orderService.markAsDelivered(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-purchases")
    @PreAuthorize("hasAnyRole('DISTRIBUTOR', 'RETAILER', 'CONSUMER')")
    public ResponseEntity<?> getMyPurchases(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long buyerId = jwtUtil.extractUserId(token);
            
            List<Order> orders = orderService.getOrdersByBuyer(buyerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-sales")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER')")
    public ResponseEntity<?> getMySales(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long sellerId = jwtUtil.extractUserId(token);
            
            List<Order> orders = orderService.getOrdersBySeller(sellerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/pending-sales")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER')")
    public ResponseEntity<?> getPendingSales(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long sellerId = jwtUtil.extractUserId(token);
            
            List<Order> orders = orderService.getPendingOrdersForSeller(sellerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
