package com.farmxchain.backend.controller;

import com.farmxchain.backend.dto.CropRequest;
import com.farmxchain.backend.dto.CropResponse;
import com.farmxchain.backend.service.CropService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    private final CropService cropService;

    @org.springframework.beans.factory.annotation.Autowired
    private com.farmxchain.backend.repository.UserRepository userRepo;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @PostMapping("/add")
    public CropResponse addCrop(@RequestBody CropRequest request, org.springframework.security.core.Authentication authentication) throws Exception {
        if (authentication != null) {
             String email = authentication.getName();
             com.farmxchain.backend.model.User user = userRepo.findByEmail(email)
                 .orElseThrow(() -> new RuntimeException("User not found"));
             request.setFarmerId(user.getId());
        }
        return cropService.addCrop(request);
    }

    @GetMapping
    public java.util.List<CropResponse> getAllCrops() {
        return cropService.getAllCrops();
    }

    @GetMapping("/my-crops")
    public java.util.List<CropResponse> getMyCrops(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("User not authenticated");
        }
        String email = authentication.getName();
        com.farmxchain.backend.model.User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return cropService.getCropsByFarmerId(user.getId());
    }

    @GetMapping("/my-inventory")
    public java.util.List<CropResponse> getMyInventory(org.springframework.security.core.Authentication authentication) {
        if (authentication == null) throw new RuntimeException("User not authenticated");
        String email = authentication.getName();
        com.farmxchain.backend.model.User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return cropService.getCropsByCurrentOwnerId(user.getId());
    }

    @GetMapping("/marketplace")
    public java.util.List<CropResponse> getMarketplace() {
        return cropService.getMarketplaceCrops();
    }

    @GetMapping("/{id}")
    public CropResponse getCrop(@PathVariable Long id) {
        return cropService.getCrop(id);
    }

    @PostMapping("/{id}/certificate")
    public org.springframework.http.ResponseEntity<?> uploadCertificate(@PathVariable Long id, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            cropService.uploadCertificate(id, file);
            return org.springframework.http.ResponseEntity.ok("Certificate uploaded successfully");
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }
    @PutMapping("/{id}/list")
    public ResponseEntity<?> updateListing(
            @PathVariable Long id, 
            @RequestBody java.util.Map<String, Object> payload, 
            org.springframework.security.core.Authentication authentication) {
        try {
            if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
            
            String email = authentication.getName();
            com.farmxchain.backend.model.User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Boolean available = (Boolean) payload.get("available");
            java.math.BigDecimal price = null;
            if (payload.get("price") != null) {
                price = new java.math.BigDecimal(payload.get("price").toString());
            }
            Double quantity = null;
            if (payload.get("quantity") != null) {
                quantity = Double.valueOf(payload.get("quantity").toString());
            }
            
            return ResponseEntity.ok(cropService.updateListing(id, available, price, quantity, user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
