package com.farmxchain.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CropRequest {

    @NotNull(message = "Farmer ID is required")
    private Long farmerId;

    @NotBlank(message = "Crop name is required")
    private String cropName;

    @NotNull(message = "Quantity is required")
    private Double quantity;

    @NotBlank(message = "Harvest date is required")
    private String harvestDate;

    private String cropType;
    private String unit;
    private String soilType;
    private String location;
    private String description;
    private Boolean availableForSale;
    private java.math.BigDecimal pricePerUnit;
    private String certificatePath;
}
