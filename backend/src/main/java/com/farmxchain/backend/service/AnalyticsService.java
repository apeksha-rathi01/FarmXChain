package com.farmxchain.backend.service;

import com.farmxchain.backend.repository.CropRepository;
import com.farmxchain.backend.repository.OrderRepository;
import com.farmxchain.backend.repository.UserRepository;
import com.farmxchain.backend.model.Crop;
import com.farmxchain.backend.model.Order;
import com.farmxchain.backend.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private UserRepository userRepository;

    // --- Public Traceability ---
    public Map<String, Object> getCropJourney(Long cropId) {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        // Enrich crop data for the UI
        Map<String, Object> cropData = new HashMap<>();
        cropData.put("id", crop.getId());
        cropData.put("cropName", crop.getCropName());
        cropData.put("cropType", crop.getCropType());
        cropData.put("quantity", crop.getQuantity());
        cropData.put("unit", crop.getUnit());
        cropData.put("harvestDate", crop.getHarvestDate());
        cropData.put("location", crop.getLocation());
        cropData.put("blockchainHash", crop.getBlockchainHash());
        cropData.put("availableForSale", crop.getAvailableForSale());
        
        // Find producer info
        userRepository.findById(crop.getFarmerId()).ifPresent(farmer -> {
            cropData.put("farmerName", farmer.getName());
            // Assuming Farmer profile contains more info, but for now we use User name
        });

        // Get history from orders (who bought/sold it)
        List<Map<String, Object>> enrichedHistory = orderRepository.findAll().stream()
                .filter(o -> o.getCrop() != null && o.getCrop().getId().equals(cropId))
                .sorted((a, b) -> a.getOrderDate().compareTo(b.getOrderDate()))
                .map(o -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", o.getId());
                    map.put("orderDate", o.getOrderDate());
                    map.put("quantity", o.getQuantity());
                    map.put("totalPrice", o.getTotalPrice());
                    map.put("status", o.getStatus());
                    map.put("transactionHash", o.getBlockchainTransactionHash());
                    
                    Map<String, Object> buyerMap = new HashMap<>();
                    buyerMap.put("id", o.getBuyer().getId());
                    buyerMap.put("name", o.getBuyer().getName());
                    map.put("buyer", buyerMap);
                    
                    Map<String, Object> sellerMap = new HashMap<>();
                    sellerMap.put("id", o.getSeller().getId());
                    sellerMap.put("name", o.getSeller().getName());
                    map.put("seller", sellerMap);
                    
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("crop", cropData);
        result.put("history", enrichedHistory);
        return result;
    }

    // --- Farmer Analytics ---
    public Map<String, Object> getFarmerAnalytics(Long farmerId) {
        List<Order> sales = orderRepository.findBySellerId(farmerId);

        BigDecimal totalIncome = sales.stream()
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalOrders = sales.size();
        
        // Group by crop name
        Map<String, Long> salesByCrop = sales.stream()
                .collect(Collectors.groupingBy(o -> o.getCrop().getCropName(), Collectors.counting()));

        Map<String, Object> data = new HashMap<>();
        data.put("totalIncome", totalIncome);
        data.put("totalOrders", totalOrders);
        data.put("salesByCrop", salesByCrop);
        
        return data;
    }

    // --- System Analytics (Admin) ---
    public Map<String, Object> getSystemAnalytics() {
        long totalUsers = userRepository.count();
        long totalFarmers = userRepository.findAll().stream().filter(u -> u.getRole() == Role.FARMER).count();
        long totalOrders = orderRepository.count();
        long totalCrops = cropRepository.count();

        Map<String, Object> data = new HashMap<>();
        data.put("totalUsers", totalUsers);
        data.put("totalFarmers", totalFarmers);
        data.put("totalOrders", totalOrders);
        data.put("totalCrops", totalCrops);
        
        return data;
    }

    // --- Demand Trends Analytics ---
    public Map<String, Object> getDemandTrends() {
        List<Order> allOrders = orderRepository.findAll();
        
        // Group by crop name and count orders
        Map<String, Long> demandByCrop = allOrders.stream()
                .collect(Collectors.groupingBy(
                    o -> o.getCrop().getCropName(), 
                    Collectors.counting()
                ));

        // Calculate total quantity demanded per crop
        Map<String, Double> quantityByCrop = allOrders.stream()
                .collect(Collectors.groupingBy(
                    o -> o.getCrop().getCropName(),
                    Collectors.summingDouble(Order::getQuantity)
                ));

        Map<String, Object> data = new HashMap<>();
        data.put("demandByCrop", demandByCrop);
        data.put("quantityByCrop", quantityByCrop);
        data.put("totalOrders", allOrders.size());
        
        return data;
    }

    // --- Pricing Trends Analytics ---
    public Map<String, Object> getPricingTrends() {
        List<Order> allOrders = orderRepository.findAll();
        
        // Calculate average price per crop
        Map<String, Double> avgPriceByCrop = allOrders.stream()
                .filter(o -> o.getCrop() != null && o.getCrop().getCropName() != null && o.getTotalPrice() != null && o.getQuantity() != null && o.getQuantity() > 0)
                .collect(Collectors.groupingBy(
                    o -> o.getCrop().getCropName(),
                    Collectors.averagingDouble(o -> o.getTotalPrice().doubleValue() / o.getQuantity())
                ));

        // Get all crops with their current prices
        List<Crop> allCrops = cropRepository.findAll();
        Map<String, BigDecimal> currentPrices = allCrops.stream()
                .filter(c -> c.getCropName() != null && c.getPricePerUnit() != null)
                .collect(Collectors.toMap(
                    Crop::getCropName,
                    Crop::getPricePerUnit,
                    (existing, replacement) -> existing // Keep first if duplicates
                ));

        Map<String, Object> data = new HashMap<>();
        data.put("averagePricePerCrop", avgPriceByCrop);
        data.put("currentPrices", currentPrices);
        
        return data;
    }

    // --- Supply Chain Performance Metrics ---
    public Map<String, Object> getSupplyChainMetrics() {
        List<Order> allOrders = orderRepository.findAll();
        
        // Order status distribution
        Map<String, Long> ordersByStatus = allOrders.stream()
                .collect(Collectors.groupingBy(
                    o -> o.getStatus() != null ? o.getStatus().toString() : "UNKNOWN",
                    Collectors.counting()
                ));

        // Calculate fulfillment rate
        long completedOrders = allOrders.stream()
                .filter(o -> "DELIVERED".equals(o.getStatus() != null ? o.getStatus().toString() : ""))
                .count();
        double fulfillmentRate = allOrders.isEmpty() ? 0 : (completedOrders * 100.0) / allOrders.size();

        // Total transaction volume
        BigDecimal totalVolume = allOrders.stream()
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> data = new HashMap<>();
        data.put("ordersByStatus", ordersByStatus);
        data.put("fulfillmentRate", fulfillmentRate);
        data.put("totalTransactionVolume", totalVolume);
        data.put("totalOrders", allOrders.size());
        
        return data;
    }

    // --- Distributor Analytics ---
    public Map<String, Object> getDistributorAnalytics(Long distributorId) {
        List<Order> purchases = orderRepository.findByBuyerId(distributorId);
        List<Order> sales = orderRepository.findBySellerId(distributorId);

        BigDecimal totalPurchases = purchases.stream()
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSales = sales.stream()
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal profit = totalSales.subtract(totalPurchases);

        Map<String, Object> data = new HashMap<>();
        data.put("totalPurchases", totalPurchases);
        data.put("totalSales", totalSales);
        data.put("profit", profit);
        data.put("purchaseCount", purchases.size());
        data.put("salesCount", sales.size());
        
        return data;
    }

    // --- Retailer Analytics ---
    public Map<String, Object> getRetailerAnalytics(Long retailerId) {
        List<Order> purchases = orderRepository.findByBuyerId(retailerId);
        List<Order> sales = orderRepository.findBySellerId(retailerId);

        BigDecimal totalPurchases = purchases.stream()
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSales = sales.stream()
                .map(Order::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal profit = totalSales.subtract(totalPurchases);

        Map<String, Object> data = new HashMap<>();
        data.put("totalPurchases", totalPurchases);
        data.put("totalSales", totalSales);
        data.put("profit", profit);
        data.put("purchaseCount", purchases.size());
        data.put("salesCount", sales.size());
        
        return data;
    }
}

