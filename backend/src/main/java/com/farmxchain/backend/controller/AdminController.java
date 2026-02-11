package com.farmxchain.backend.controller;

import com.farmxchain.backend.dto.FarmerResponse;
import com.farmxchain.backend.model.Farmer;
import com.farmxchain.backend.model.User;
import com.farmxchain.backend.service.FarmerService;
import com.farmxchain.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // 🔐 ADMIN ONLY
public class AdminController {

    @Autowired
    private FarmerService farmerService;

    @Autowired
    private UserService userService;

    @Autowired
    private com.farmxchain.backend.repository.UserRepository userRepo;

    @Autowired
    private com.farmxchain.backend.repository.FarmerRepository farmerRepo;

    // -------------------------------
    // List Pending Farmers
    // -------------------------------
    @GetMapping("/pending-farmers")
    public List<FarmerResponse> getPendingFarmers() {
        return farmerService.getPendingFarmers()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // -------------------------------
    // Stats: Total Farmers Count
    // -------------------------------
    @GetMapping("/stats/farmers/count")
    public Long getFarmerCount() {
        return farmerRepo.count();
    }

    // -------------------------------
    // Stats: Total Users Count
    // -------------------------------
    @GetMapping("/stats/users/count")
    public Long getUserCount() {
        return userRepo.count();
    }

    // -------------------------------
    // Approve Farmer
    // -------------------------------
    @PutMapping("/approve/{id}")
    public String approveFarmer(@PathVariable Long id) {
        farmerService.approveFarmer(id);
        return "Farmer approved successfully!";
    }

    // -------------------------------
    // Reject Farmer
    // -------------------------------
    @DeleteMapping("/reject/{id}")   // ✅ DELETE is correct
    public String rejectFarmer(@PathVariable Long id) {
        farmerService.rejectFarmer(id);
        return "Farmer rejected and removed!";
    }

    // -------------------------------
    // Get All Users (ADMIN)
    // -------------------------------
    // -------------------------------
    // Get All Users (ADMIN) - Enriched with Status
    // -------------------------------
    @GetMapping("/users")
    public List<java.util.Map<String, Object>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<Farmer> farmers = farmerRepo.findAll();
        
        // Optimize lookup
        java.util.Map<Long, Farmer> farmerMap = farmers.stream()
            .collect(Collectors.toMap(f -> f.getUser().getId(), f -> f, (f1, f2) -> f1));

        return users.stream().map(user -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", user.getId());
            map.put("name", user.getName());
            map.put("email", user.getEmail());
            map.put("role", user.getRole());
            map.put("phone", ""); // Placeholder if needed by UI
            
            // Compute Status
            String status = user.isEnabled() ? "ACTIVE" : "SUSPENDED";
            
            if (user.getRole() == com.farmxchain.backend.model.Role.FARMER) {
                 if (farmerMap.containsKey(user.getId())) {
                     if (!farmerMap.get(user.getId()).isApproved()) {
                         status = "PENDING";
                     }
                 }
            }
            map.put("status", status);
            
            return map;
        }).collect(Collectors.toList());
    }

    // -------------------------------
    // User Lifecycle Management
    // -------------------------------
    @PostMapping("/users/{id}/verify")
    public String verifyUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        user.setEnabled(true);
        userRepo.save(user);
        return "User verified successfully!";
    }

    @PostMapping("/users/{id}/suspend")
    public String suspendUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        user.setEnabled(false);
        userRepo.save(user);
        return "User suspended!";
    }

    @PostMapping("/users/{id}/activate")
    public String activateUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        user.setEnabled(true);
        userRepo.save(user);
        return "User activated!";
    }

    @Autowired
    private com.farmxchain.backend.service.ReportService reportService;

    // -------------------------------
    // Reports
    // -------------------------------
    @PostMapping("/reports/generate")
    public com.farmxchain.backend.model.Report generateReport(org.springframework.security.core.Authentication authentication) {
        return reportService.generateSystemReport(authentication.getName());
    }

    @GetMapping("/reports")
    public List<com.farmxchain.backend.model.Report> getReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/reports/{id}")
    public com.farmxchain.backend.model.Report getReportById(@PathVariable Long id) {
        return reportService.getReportById(id);
    }

    @PostMapping("/reports/user-activity")
    public com.farmxchain.backend.model.Report generateUserActivityReport(org.springframework.security.core.Authentication authentication) {
        return reportService.generateUserActivityReport(authentication.getName());
    }

    @PostMapping("/reports/transactions")
    public com.farmxchain.backend.model.Report generateTransactionReport(org.springframework.security.core.Authentication authentication) {
        return reportService.generateTransactionReport(authentication.getName());
    }

    @PostMapping("/reports/supply-chain")
    public com.farmxchain.backend.model.Report generateSupplyChainReport(org.springframework.security.core.Authentication authentication) {
        return reportService.generateSupplyChainReport(authentication.getName());
    }

    @PostMapping("/reports/disputes")
    public com.farmxchain.backend.model.Report generateDisputeReport(org.springframework.security.core.Authentication authentication) {
        return reportService.generateDisputeReport(authentication.getName());
    }

    @DeleteMapping("/reports/{id}")
    public String deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return "Report deleted successfully";
    }

    // -------------------------------
    // Mapper
    // -------------------------------
    private FarmerResponse mapToResponse(Farmer farmer) {
        FarmerResponse response = new FarmerResponse();
        response.setId(farmer.getId());
        response.setUserId(farmer.getUser().getId());
        response.setName(farmer.getUser().getName());
        response.setEmail(farmer.getUser().getEmail());
        response.setPhoneNumber(farmer.getPhoneNumber()); // Updated
        response.setLocation(farmer.getLocation());      // Updated
        response.setApproved(farmer.isApproved());
        response.setBankName(farmer.getBankName());
        response.setBankAccountNumber(farmer.getBankAccountNumber()); // Updated
        response.setIfscCode(farmer.getIfscCode());
        return response;
    }
}