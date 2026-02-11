package com.farmxchain.backend.dto;

public class DisputeRequest {
    private Long orderId;
    private Long reportedAgainstId;
    private String reason;
    private String description;

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getReportedAgainstId() {
        return reportedAgainstId;
    }

    public void setReportedAgainstId(Long reportedAgainstId) {
        this.reportedAgainstId = reportedAgainstId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
