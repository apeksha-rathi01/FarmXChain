package com.farmxchain.backend.service;

import com.farmxchain.backend.dto.ShipmentDTO;
import com.farmxchain.backend.model.*;
import com.farmxchain.backend.repository.OrderRepository;
import com.farmxchain.backend.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @Transactional
    public Shipment createShipment(ShipmentDTO shipmentDTO) {
        Order order = orderRepository.findById(shipmentDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.ACCEPTED) {
            throw new RuntimeException("Can only create shipment for accepted orders");
        }

        // Check if shipment already exists
        if (shipmentRepository.findByOrderId(order.getId()).isPresent()) {
            throw new RuntimeException("Shipment already exists for this order");
        }

        Shipment shipment = new Shipment(order, shipmentDTO.getCurrentLocation(), shipmentDTO.getTransportMode());
        shipment.setCarrierName(shipmentDTO.getCarrierName());
        shipment.setTrackingNumber(generateTrackingNumber());
        shipment.setEstimatedDelivery(LocalDateTime.now().plusDays(3)); // Dummy estimate
        shipment.setStatus(ShipmentStatus.SHIPPED);
        
        // Mock IoT Data for Academic Demo
        shipment.setTemperature(20.0 + (Math.random() * 5)); 
        shipment.setHumidity(50.0 + (Math.random() * 10));
        shipment.setLastSensorUpdate(LocalDateTime.now());
        
        // Mock Blockchain Hash for proof of shipment
        shipment.setBlockchainHash("0x" + UUID.randomUUID().toString().replace("-", ""));

        // Update order status via OrderService to keep logic centralized
        orderService.markAsShipped(order.getId());

        return shipmentRepository.save(shipment);
    }

    @Transactional
    public Shipment updateLocation(Long shipmentId, String location) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        shipment.setCurrentLocation(location);
        shipment.setUpdatedAt(LocalDateTime.now());

        return shipmentRepository.save(shipment);
    }

    @Transactional
    public Shipment updateCondition(Long shipmentId, Double temperature, Double humidity) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        if (temperature != null) shipment.setTemperature(temperature);
        if (humidity != null) shipment.setHumidity(humidity);
        shipment.setLastSensorUpdate(LocalDateTime.now());

        return shipmentRepository.save(shipment);
    }

    @Transactional
    public Shipment updateStatus(Long shipmentId, ShipmentStatus status) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        shipment.setStatus(status);

        if (status == ShipmentStatus.DELIVERED) {
            shipment.setActualDelivery(LocalDateTime.now());
            // Update order status via OrderService
            orderService.markAsDelivered(shipment.getOrder().getId());
        }

        return shipmentRepository.save(shipment);
    }

    public Shipment getShipmentByOrder(Long orderId) {
        return shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Shipment not found for this order"));
    }

    public Shipment getShipmentById(Long shipmentId) {
        return shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
    }

    public Shipment trackShipment(String trackingNumber) {
        return shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Shipment not found with tracking number: " + trackingNumber));
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public List<Shipment> getShipmentsByStatus(ShipmentStatus status) {
        return shipmentRepository.findByStatus(status);
    }

    private String generateTrackingNumber() {
        return "FXC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    // IoT Simulation for Demo
    @Transactional
    public Shipment simulateMovement(Long shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
                
        // Only simulate if not yet delivered
        if (shipment.getStatus() == ShipmentStatus.DELIVERED) return shipment;

        String[] locations = {"Local Hub", "In Transit - Highway 42", "Regional Distribution Ctr", "Last Mile Hub"};
        
        // If already at Last Mile Hub, deliver it
        if ("Last Mile Hub".equals(shipment.getCurrentLocation())) {
             shipment.setCurrentLocation("Delivered to Customer");
             shipment.setStatus(ShipmentStatus.DELIVERED);
             shipment.setActualDelivery(LocalDateTime.now());
             orderService.markAsDelivered(shipment.getOrder().getId());
        } else {
             // Move to random location
             int currentIndex = (int) (Math.random() * locations.length);
             shipment.setCurrentLocation(locations[currentIndex]);
        }

        shipment.setTemperature(18.0 + (Math.random() * 10)); 
        shipment.setHumidity(40.0 + (Math.random() * 30)); 
        shipment.setLastSensorUpdate(LocalDateTime.now());

        return shipmentRepository.save(shipment);
    }
}
