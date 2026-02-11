package com.farmxchain.backend.controller;

import com.farmxchain.backend.dto.ShipmentDTO;
import com.farmxchain.backend.model.Shipment;
import com.farmxchain.backend.model.ShipmentStatus;
import com.farmxchain.backend.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    @Autowired
    private ShipmentService shipmentService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER')")
    public ResponseEntity<?> createShipment(@RequestBody ShipmentDTO shipmentDTO) {
        try {
            Shipment shipment = shipmentService.createShipment(shipmentDTO);
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/location")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER', 'ADMIN')")
    public ResponseEntity<?> updateLocation(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String location = payload.get("location");
            Shipment shipment = shipmentService.updateLocation(id, location);
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/condition")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER', 'ADMIN')")
    public ResponseEntity<?> updateCondition(@PathVariable Long id, @RequestBody Map<String, Double> payload) {
        try {
            Double temperature = payload.get("temperature");
            Double humidity = payload.get("humidity");
            Shipment shipment = shipmentService.updateCondition(id, temperature, humidity);
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/simulate")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER')")
    public ResponseEntity<?> simulateMovement(@PathVariable Long id) {
        try {
            Shipment shipment = shipmentService.simulateMovement(id);
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER', 'ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            ShipmentStatus status = ShipmentStatus.valueOf(payload.get("status"));
            Shipment shipment = shipmentService.updateStatus(id, status);
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getShipmentByOrder(@PathVariable Long orderId) {
        try {
            Shipment shipment = shipmentService.getShipmentByOrder(orderId);
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getShipmentById(@PathVariable Long id) {
        try {
            Shipment shipment = shipmentService.getShipmentById(id);
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<?> trackShipment(@PathVariable String trackingNumber) {
        try {
            Shipment shipment = shipmentService.trackShipment(trackingNumber);
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllShipments() {
        try {
            List<Shipment> shipments = shipmentService.getAllShipments();
            return ResponseEntity.ok(shipments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('FARMER', 'DISTRIBUTOR', 'RETAILER', 'ADMIN')")
    public ResponseEntity<?> getShipmentsByStatus(@PathVariable String status) {
        try {
            ShipmentStatus shipmentStatus = ShipmentStatus.valueOf(status);
            List<Shipment> shipments = shipmentService.getShipmentsByStatus(shipmentStatus);
            return ResponseEntity.ok(shipments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
