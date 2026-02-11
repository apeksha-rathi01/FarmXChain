package com.farmxchain.backend.service;

import com.farmxchain.backend.contracts.CropRegistry;
import com.farmxchain.backend.dto.CropRequest;
import com.farmxchain.backend.dto.CropResponse;
import com.farmxchain.backend.model.Crop;
import com.farmxchain.backend.repository.CropRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class CropService {

    private final CropRepository cropRepository;
    private final BlockchainService blockchainService;
    private final com.farmxchain.backend.repository.FarmerRepository farmerRepository;
    private final com.farmxchain.backend.repository.UserRepository userRepository;

    public CropService(CropRepository cropRepository, BlockchainService blockchainService, com.farmxchain.backend.repository.FarmerRepository farmerRepository, com.farmxchain.backend.repository.UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.blockchainService = blockchainService;
        this.farmerRepository = farmerRepository;
        this.userRepository = userRepository;
    }

    public CropResponse addCrop(CropRequest request) throws Exception {
        Crop crop = new Crop();
        crop.setFarmerId(request.getFarmerId());
        crop.setCropName(request.getCropName());
        crop.setQuantity(request.getQuantity());
        crop.setHarvestDate(request.getHarvestDate());
        crop.setCropType(request.getCropType());
        crop.setUnit(request.getUnit());
        crop.setSoilType(request.getSoilType());
        crop.setLocation(request.getLocation());
        crop.setDescription(request.getDescription());
        crop.setCertificatePath(request.getCertificatePath());
        
        // Defaults for Milestone 3
        crop.setCurrentOwnerId(request.getFarmerId());
        crop.setStatus("HARVESTED");
        crop.setAvailableForSale(request.getAvailableForSale() != null ? request.getAvailableForSale() : false);
        crop.setPricePerUnit(request.getPricePerUnit());
        crop.setAvailableQuantity(request.getQuantity());

        try {
            CropRegistry contract = blockchainService.loadContract();
            var receipt = contract.registerCrop(
                    crop.getCropName(),
                    crop.getFarmerId().toString(),
                    crop.getHarvestDate(),
                    "Q:" + crop.getQuantity() + " " + crop.getUnit()
            ).send();
            crop.setBlockchainHash(receipt.getTransactionHash());
        } catch (Exception e) {
            System.err.println("Blockchain registration failed: " + e.getMessage());
            crop.setBlockchainHash("PENDING-PROTOCOL-" + System.currentTimeMillis());
        }

        Crop savedCrop = cropRepository.save(crop);
        return mapToResponse(savedCrop);
    }

    public void uploadCertificate(Long cropId, org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));
        
        String uploadDir = "uploads/certificates/";
        java.io.File directory = new java.io.File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir + fileName);
        java.nio.file.Files.write(filePath, file.getBytes());
        
        crop.setCertificatePath(filePath.toString());
        cropRepository.save(crop);
    }

    public java.util.List<CropResponse> getCropsByFarmerId(Long farmerId) {
        return cropRepository.findByFarmerId(farmerId).stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    public java.util.List<CropResponse> getAllCrops() {
        return cropRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    public java.util.List<CropResponse> getCropsByCurrentOwnerId(Long ownerId) {
        return cropRepository.findByCurrentOwnerId(ownerId).stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    public java.util.List<CropResponse> getMarketplaceCrops() {
        return cropRepository.findByAvailableForSaleTrue().stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    public CropResponse getCrop(Long id) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));
        return mapToResponse(crop);
    }

    private CropResponse mapToResponse(Crop crop) {
        CropResponse response = new CropResponse();
        response.setId(crop.getId());
        response.setFarmerId(crop.getFarmerId());
        response.setCropName(crop.getCropName());
        response.setQuantity(crop.getQuantity());
        response.setHarvestDate(crop.getHarvestDate());
        response.setBlockchainHash(crop.getBlockchainHash());
        response.setCropType(crop.getCropType());
        response.setUnit(crop.getUnit());
        response.setSoilType(crop.getSoilType());
        response.setLocation(crop.getLocation());
        response.setDescription(crop.getDescription());
        response.setCertificatePath(crop.getCertificatePath());

        // Milestone 3 fields
        response.setAvailableForSale(crop.getAvailableForSale());
        response.setPricePerUnit(crop.getPricePerUnit());
        response.setAvailableQuantity(crop.getAvailableQuantity());
        response.setCurrentOwnerId(crop.getCurrentOwnerId());
        response.setStatus(crop.getStatus());

        // Populate Owner name
        if (crop.getCurrentOwnerId() != null) {
            userRepository.findById(crop.getCurrentOwnerId()).ifPresent(user -> {
                response.setCurrentOwnerName(user.getName());
            });
        }

        // Populate Farmer details for Traceability
        farmerRepository.findAll().stream()
            .filter(f -> f.getUser().getId().equals(crop.getFarmerId()))
            .findFirst()
            .ifPresent(farmer -> {
                response.setFarmerName(farmer.getUser().getName());
                response.setFarmName(farmer.getFarmName());
            });

        return response;
    }

    @org.springframework.transaction.annotation.Transactional
    public CropResponse updateListing(Long id, Boolean available, java.math.BigDecimal price, Double quantity, Long userId) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        if (!crop.getCurrentOwnerId().equals(userId)) {
            throw new RuntimeException("Only the current owner can list this crop for sale");
        }

        crop.setAvailableForSale(available);
        if (price != null) crop.setPricePerUnit(price);
        if (quantity != null) crop.setAvailableQuantity(quantity);

        return mapToResponse(cropRepository.save(crop));
    }
}
