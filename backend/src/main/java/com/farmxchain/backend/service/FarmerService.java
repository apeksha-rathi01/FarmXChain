package com.farmxchain.backend.service;

import com.farmxchain.backend.model.Farmer;
import com.farmxchain.backend.model.User;
import com.farmxchain.backend.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FarmerService {

    @Autowired
    private FarmerRepository farmerRepo;

    public Farmer createFarmer(Farmer farmer, User user) {
        farmer.setUser(user);
        farmer.setApproved(false);
        return farmerRepo.save(farmer);
    }

    public Optional<Farmer> getFarmerByUser(User user) {
        return farmerRepo.findByUser(user);
    }

    public List<Farmer> getPendingFarmers() {
        return farmerRepo.findByApprovedFalse();
    }

    public Farmer approveFarmer(Long id) {
        Farmer farmer = farmerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        farmer.setApproved(true);
        
        // 🔓 ACTIVATE USER ACCOUNT
        User user = farmer.getUser();
        user.setEnabled(true);
        
        return farmerRepo.save(farmer);
    }

    public void rejectFarmer(Long id) {
        Farmer farmer = farmerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        
        // ⛔ DENY ACCESS: Disable User
        User user = farmer.getUser();
        user.setEnabled(false);
        
        farmerRepo.delete(farmer);
    }

    public Farmer updateFarmer(Farmer existingFarmer, Farmer newDetails) {
        existingFarmer.setFarmName(newDetails.getFarmName());
        existingFarmer.setPhoneNumber(newDetails.getPhoneNumber());
        existingFarmer.setLocation(newDetails.getLocation());
        existingFarmer.setState(newDetails.getState());
        existingFarmer.setDistrict(newDetails.getDistrict());
        existingFarmer.setLandArea(newDetails.getLandArea());
        existingFarmer.setLandUnit(newDetails.getLandUnit());
        existingFarmer.setPrimaryCrop(newDetails.getPrimaryCrop());
        existingFarmer.setSoilType(newDetails.getSoilType());
        existingFarmer.setBankName(newDetails.getBankName());
        existingFarmer.setBankAccountNumber(newDetails.getBankAccountNumber());
        existingFarmer.setIfscCode(newDetails.getIfscCode());
        // Do not update user, approved status, or ID
        return farmerRepo.save(existingFarmer);
    }
}