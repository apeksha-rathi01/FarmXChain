package com.farmxchain.backend.dto;

import java.time.LocalDateTime;

public class DisputeResponse {
    private Long id;
    private Long orderId;
    private String reportedByName;
    private String reportedByEmail;
    private String reportedAgainstName;
    private String reportedAgainstEmail;
    private String reason;
    private String description;
    private String status;
    private String resolution;
    private LocalDateTime createdDate;
    private LocalDateTime resolvedDate;
    private String resolvedByName;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getReportedByName() {
        return reportedByName;
    }

    public void setReportedByName(String reportedByName) {
        this.reportedByName = reportedByName;
    }

    public String getReportedByEmail() {
        return reportedByEmail;
    }

    public void setReportedByEmail(String reportedByEmail) {
        this.reportedByEmail = reportedByEmail;
    }

    public String getReportedAgainstName() {
        return reportedAgainstName;
    }

    public void setReportedAgainstName(String reportedAgainstName) {
        this.reportedAgainstName = reportedAgainstName;
    }

    public String getReportedAgainstEmail() {
        return reportedAgainstEmail;
    }

    public void setReportedAgainstEmail(String reportedAgainstEmail) {
        this.reportedAgainstEmail = reportedAgainstEmail;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getResolvedDate() {
        return resolvedDate;
    }

    public void setResolvedDate(LocalDateTime resolvedDate) {
        this.resolvedDate = resolvedDate;
    }

    public String getResolvedByName() {
        return resolvedByName;
    }

    public void setResolvedByName(String resolvedByName) {
        this.resolvedByName = resolvedByName;
    }
}
