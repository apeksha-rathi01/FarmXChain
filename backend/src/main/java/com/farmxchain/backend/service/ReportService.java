package com.farmxchain.backend.service;

import com.farmxchain.backend.model.Report;
import com.farmxchain.backend.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private com.farmxchain.backend.repository.OrderRepository orderRepository;

    @Autowired
    private com.farmxchain.backend.repository.UserRepository userRepository;

    @Autowired
    private com.farmxchain.backend.repository.DisputeRepository disputeRepository;

    @Autowired
    private com.farmxchain.backend.repository.ShipmentRepository shipmentRepository;

    public Report generateSystemReport(String adminName) {
        Map<String, Object> stats = analyticsService.getSystemAnalytics();
        
        Report report = new Report();
        report.setTitle("System Health Report - " + LocalDateTime.now().toLocalDate());
        report.setType("SYSTEM");
        report.setGeneratedBy(adminName);
        
        // Create JSON-formatted content
        String content = String.format(
            "{\"totalUsers\":%d,\"totalOrders\":%d,\"totalCrops\":%d,\"totalFarmers\":%d}",
            stats.get("totalUsers"),
            stats.get("totalOrders"),
            stats.get("totalCrops"),
            stats.get("totalFarmers")
        );
        report.setContent(content);
        
        return reportRepository.save(report);
    }

    public Report generateUserActivityReport(String adminName) {
        Map<String, Object> stats = analyticsService.getSystemAnalytics();
        long totalUsers = userRepository.count();
        
        // Count users by role
        Map<String, Long> usersByRole = userRepository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    u -> u.getRole().toString(),
                    java.util.stream.Collectors.counting()
                ));
        
        Report report = new Report();
        report.setTitle("User Activity Report - " + LocalDateTime.now().toLocalDate());
        report.setType("USER_ACTIVITY");
        report.setGeneratedBy(adminName);
        
        String content = String.format(
            "Total Users: %d, Users by Role: %s",
            totalUsers,
            usersByRole.toString()
        );
        report.setContent(content);
        
        return reportRepository.save(report);
    }

    public Report generateTransactionReport(String adminName) {
        List<com.farmxchain.backend.model.Order> orders = orderRepository.findAll();
        
        java.math.BigDecimal totalRevenue = orders.stream()
                .map(com.farmxchain.backend.model.Order::getTotalPrice)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        
        Map<String, Long> ordersByStatus = orders.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    o -> o.getStatus() != null ? o.getStatus().toString() : "UNKNOWN",
                    java.util.stream.Collectors.counting()
                ));
        
        Report report = new Report();
        report.setTitle("Transaction Report - " + LocalDateTime.now().toLocalDate());
        report.setType("TRANSACTION");
        report.setGeneratedBy(adminName);
        
        String content = String.format(
            "Total Orders: %d, Total Revenue: ₹%s, Orders by Status: %s",
            orders.size(),
            totalRevenue.toString(),
            ordersByStatus.toString()
        );
        report.setContent(content);
        
        return reportRepository.save(report);
    }

    public Report generateSupplyChainReport(String adminName) {
        Map<String, Object> metrics = analyticsService.getSupplyChainMetrics();
        
        Report report = new Report();
        report.setTitle("Supply Chain Report - " + LocalDateTime.now().toLocalDate());
        report.setType("SUPPLY_CHAIN");
        report.setGeneratedBy(adminName);
        
        String content = String.format(
            "Fulfillment Rate: %.2f%%, Total Orders: %d, Transaction Volume: ₹%s",
            metrics.get("fulfillmentRate"),
            metrics.get("totalOrders"),
            metrics.get("totalTransactionVolume")
        );
        report.setContent(content);
        
        return reportRepository.save(report);
    }

    public Report generateDisputeReport(String adminName) {
        List<com.farmxchain.backend.model.Dispute> disputes = disputeRepository.findAll();
        
        Map<String, Long> disputesByStatus = disputes.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    com.farmxchain.backend.model.Dispute::getStatus,
                    java.util.stream.Collectors.counting()
                ));
        
        long resolvedDisputes = disputes.stream()
                .filter(d -> "RESOLVED".equals(d.getStatus()))
                .count();
        
        double resolutionRate = disputes.isEmpty() ? 0 : (resolvedDisputes * 100.0) / disputes.size();
        
        Report report = new Report();
        report.setTitle("Dispute Report - " + LocalDateTime.now().toLocalDate());
        report.setType("DISPUTE");
        report.setGeneratedBy(adminName);
        
        String content = String.format(
            "Total Disputes: %d, Resolution Rate: %.2f%%, Disputes by Status: %s",
            disputes.size(),
            resolutionRate,
            disputesByStatus.toString()
        );
        report.setContent(content);
        
        return reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }
}

