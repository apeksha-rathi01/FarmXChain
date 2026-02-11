package com.farmxchain.backend.model;

public enum OrderStatus {
    REQUESTED,   // Order created by buyer
    ACCEPTED,    // Seller accepted the order
    REJECTED,    // Seller rejected the order
    SHIPPED,     // Shipment in progress
    DELIVERED    // Order delivered and completed
}
