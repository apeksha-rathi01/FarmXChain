package com.farmxchain.backend.model;

public enum PaymentStatus {
    PENDING,        // Payment initiated
    PROCESSING,     // Payment being processed
    COMPLETED,      // Payment successful
    FAILED,         // Payment failed
    REFUNDED        // Payment refunded
}
