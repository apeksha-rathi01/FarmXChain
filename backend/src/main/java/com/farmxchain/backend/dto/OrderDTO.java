package com.farmxchain.backend.dto;

import java.math.BigDecimal;

public class OrderDTO {
    private Long cropId;
    private Long sellerId;
    private Double quantity;
    private BigDecimal pricePerUnit;
    private String deliveryAddress;
    private String notes;

    // Constructors
    public OrderDTO() {}

    public OrderDTO(Long cropId, Long sellerId, Double quantity, BigDecimal pricePerUnit) {
        this.cropId = cropId;
        this.sellerId = sellerId;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
    }

    // Getters and Setters
    public Long getCropId() {
        return cropId;
    }

    public void setCropId(Long cropId) {
        this.cropId = cropId;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(BigDecimal pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
