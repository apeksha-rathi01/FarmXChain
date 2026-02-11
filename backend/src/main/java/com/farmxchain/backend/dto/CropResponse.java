package com.farmxchain.backend.dto;

import lombok.Data;

@Data
public class CropResponse {

    private Long id;
    private Long farmerId;
    private String cropName;
    private Double quantity;
    private String harvestDate;
    private String farmerName;
    private String farmName;
    private String blockchainHash;
    private String cropType;
    private String unit;
    private String soilType;
    private String location;
    private String description;
    private String certificatePath;
    
    // Milestone 3 fields
    private Boolean availableForSale;
    private java.math.BigDecimal pricePerUnit;
    private Double availableQuantity;
    private Long currentOwnerId;
    private String currentOwnerName;
    private String status;
}
