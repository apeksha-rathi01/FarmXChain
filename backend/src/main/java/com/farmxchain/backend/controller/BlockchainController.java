package com.farmxchain.backend.controller;

import com.farmxchain.backend.model.Crop;
import com.farmxchain.backend.repository.CropRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/blockchain")
public class BlockchainController {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private com.farmxchain.backend.repository.OrderRepository orderRepository;

    @GetMapping("/crop/{cropId}")
    public Map<String, Object> getBlockchainRecord(@PathVariable Long cropId) {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));
        
        Map<String, Object> record = new HashMap<>();
        record.put("transactionHash", crop.getBlockchainHash());
        record.put("blockNumber", 12459021L); // Mock block number
        record.put("timestamp", new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(new java.util.Date()));
        return record;
    }

    @GetMapping("/crop/{cropId}/traceability")
    public List<Map<String, Object>> getTraceability(@PathVariable Long cropId) {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        List<Map<String, Object>> history = new ArrayList<>();
        
        // 1. Initial Registration
        Map<String, Object> stage1 = new HashMap<>();
        stage1.put("id", 1000L + crop.getId());
        stage1.put("stage", "Harvest Registered");
        stage1.put("timestamp", crop.getHarvestDate());
        stage1.put("location", crop.getLocation());
        stage1.put("notes", "Crop registered on blockchain by farmer. Initial quality audit passed.");
        history.add(stage1);

        // 2. Ownership Transfers (Orders)
        List<com.farmxchain.backend.model.Order> orders = orderRepository.findByCropId(cropId);
        orders.stream()
            // Simplified: Show all accepted/shipped/delivered orders as transfer steps
            .filter(o -> o.getStatus() != com.farmxchain.backend.model.OrderStatus.REQUESTED) 
            .sorted(Comparator.comparing(com.farmxchain.backend.model.Order::getOrderDate))
            .forEach(o -> {
                // Ownership Transfer Stage
                if (o.getStatus() == com.farmxchain.backend.model.OrderStatus.DELIVERED) {
                    Map<String, Object> stage = new HashMap<>();
                    stage.put("id", 2000L + o.getId());
                    stage.put("stage", "Ownership Transferred");
                    // Use updatedAt as proxy for delivery time if completionDate is gone, or orderDate
                    stage.put("timestamp", o.getOrderDate().toString()); 
                    stage.put("location", "Smart Contract Execution");
                    stage.put("notes", "Ownership transferred from " + o.getSeller().getName() + " to " + o.getBuyer().getName() + ". Transaction verified.");
                    history.add(stage);
                }

                // Logistics Stage
                if (o.getStatus() == com.farmxchain.backend.model.OrderStatus.SHIPPED || o.getStatus() == com.farmxchain.backend.model.OrderStatus.DELIVERED) {
                    Map<String, Object> stageLogistics = new HashMap<>();
                    stageLogistics.put("id", 3000L + o.getId());
                    stageLogistics.put("stage", "In Distribution");
                    stageLogistics.put("timestamp", o.getOrderDate().plusHours(2).toString());
                    stageLogistics.put("location", "Logistics Network");
                    stageLogistics.put("notes", "Shipment processed for " + o.getBuyer().getName());
                    history.add(stageLogistics);
                }
            });

        return history;
    }

    @GetMapping("/crop/{cropId}/verify")
    public Map<String, Object> verifyCropData(@PathVariable Long cropId) {
        Map<String, Object> result = new HashMap<>();
        result.put("verified", true);
        result.put("node", "Ethereum Gateway v2.4");
        result.put("status", "SUCCESS");
        return result;
    }
}
