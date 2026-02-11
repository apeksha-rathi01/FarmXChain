package com.farmxchain.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name="crops")
@Data
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long farmerId;
    private String cropName;
    private Double quantity;
    private String harvestDate;

    private String blockchainHash;
    private String certificatePath;

    @Column(columnDefinition = "TEXT")
    private String description;
    private String cropType;
    private String unit;
    private String soilType;
    private String location;
    
    // Marketplace fields for Milestone 3
    private Boolean availableForSale = false;
    private BigDecimal pricePerUnit;
    private Double availableQuantity; // Quantity available for sale (can be less than total quantity)
    
    private Long currentOwnerId;
    private String status; // HARVESTED, IN_DISTRIBUTION, AT_RETAIL, SOLD
}
