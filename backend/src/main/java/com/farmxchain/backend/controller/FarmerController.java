package com.farmxchain.backend.controller;

import com.farmxchain.backend.dto.FarmerRequest;
import com.farmxchain.backend.dto.FarmerResponse;
import com.farmxchain.backend.model.Farmer;
import com.farmxchain.backend.model.User;
import com.farmxchain.backend.repository.UserRepository;
import com.farmxchain.backend.service.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmer")
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @Autowired
    private UserRepository userRepo;

    // -------------------------------
    // Create Farmer Profile
    // -------------------------------
    @PostMapping("/create")
    public FarmerResponse createFarmer(@RequestBody FarmerRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Farmer farmer = mapRequestToEntity(request);
        Farmer savedFarmer = farmerService.createFarmer(farmer, user);

        return mapToResponse(savedFarmer);
    }

    // -------------------------------
    // Get Own Farmer Profile
    // -------------------------------
    @GetMapping("/me")
    public FarmerResponse getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return farmerService.getFarmerByUser(user)
                .map(this::mapToResponse)
                .orElse(null); // Return null or empty if not found, frontend should handle
    }

    // -------------------------------
    // Update Farmer Profile
    // -------------------------------
    @PutMapping("/update")
    public FarmerResponse updateFarmer(@RequestBody FarmerRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Resilient "Upsert": Find or Initialize
        Farmer farmer = farmerService.getFarmerByUser(user)
                .orElseGet(() -> {
                    Farmer f = new Farmer();
                    f.setUser(user);
                    f.setApproved(false);
                    return f;
                });

        Farmer newDetails = mapRequestToEntity(request);
        Farmer updatedFarmer = farmerService.updateFarmer(farmer, newDetails);

        return mapToResponse(updatedFarmer);
    }

    // -------------------------------
    // Mapper to Farmer Entity
    // -------------------------------
    private Farmer mapRequestToEntity(FarmerRequest request) {
        Farmer farmer = new Farmer();
        farmer.setFarmName(request.getFarmName());
        farmer.setPhoneNumber(request.getPhoneNumber());
        farmer.setLocation(request.getLocation());
        farmer.setState(request.getState());
        farmer.setDistrict(request.getDistrict());
        farmer.setLandArea(request.getLandArea());
        farmer.setLandUnit(request.getLandUnit());
        farmer.setPrimaryCrop(request.getPrimaryCrop());
        farmer.setSoilType(request.getSoilType());
        farmer.setBankName(request.getBankName());
        farmer.setBankAccountNumber(request.getBankAccountNumber());
        farmer.setIfscCode(request.getIfscCode());
        return farmer;
    }

    // -------------------------------
    // Mapper to FarmerResponse DTO
    // -------------------------------
    private FarmerResponse mapToResponse(Farmer farmer) {
        FarmerResponse response = new FarmerResponse();
        response.setId(farmer.getId());
        response.setUserId(farmer.getUser().getId());
        response.setName(farmer.getUser().getName());
        response.setEmail(farmer.getUser().getEmail());
        response.setFarmName(farmer.getFarmName());
        response.setPhoneNumber(farmer.getPhoneNumber());
        response.setLocation(farmer.getLocation());
        response.setState(farmer.getState());
        response.setDistrict(farmer.getDistrict());
        response.setLandArea(farmer.getLandArea());
        response.setLandUnit(farmer.getLandUnit());
        response.setPrimaryCrop(farmer.getPrimaryCrop());
        response.setSoilType(farmer.getSoilType());
        response.setApproved(farmer.isApproved());
        response.setBankName(farmer.getBankName());
        response.setBankAccountNumber(farmer.getBankAccountNumber());
        response.setIfscCode(farmer.getIfscCode());
        return response;
    }
}
