package com.farmxchain.backend.service;

import com.farmxchain.backend.dto.DisputeRequest;
import com.farmxchain.backend.dto.DisputeResponse;
import com.farmxchain.backend.model.Dispute;
import com.farmxchain.backend.model.Order;
import com.farmxchain.backend.model.User;
import com.farmxchain.backend.repository.DisputeRepository;
import com.farmxchain.backend.repository.OrderRepository;
import com.farmxchain.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisputeService {

    @Autowired
    private DisputeRepository disputeRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public DisputeResponse createDispute(DisputeRequest request, Long reportedById) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User reportedBy = userRepository.findById(reportedById)
                .orElseThrow(() -> new RuntimeException("Reporter not found"));

        User reportedAgainst = userRepository.findById(request.getReportedAgainstId())
                .orElseThrow(() -> new RuntimeException("Reported user not found"));

        // Validate that the reporter is part of the order
        if (!order.getBuyer().getId().equals(reportedById) && 
            !order.getSeller().getId().equals(reportedById)) {
            throw new RuntimeException("You are not authorized to create a dispute for this order");
        }

        Dispute dispute = new Dispute();
        dispute.setOrder(order);
        dispute.setReportedBy(reportedBy);
        dispute.setReportedAgainst(reportedAgainst);
        dispute.setReason(request.getReason());
        dispute.setDescription(request.getDescription());
        dispute.setStatus("OPEN");

        Dispute saved = disputeRepository.save(dispute);
        return mapToResponse(saved);
    }

    public List<DisputeResponse> getAllDisputes() {
        return disputeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DisputeResponse> getDisputesByStatus(String status) {
        return disputeRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DisputeResponse> getMyDisputes(Long userId) {
        return disputeRepository.findByReportedByIdOrReportedAgainstId(userId, userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DisputeResponse getDisputeById(Long id) {
        Dispute dispute = disputeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));
        return mapToResponse(dispute);
    }

    public DisputeResponse resolveDispute(Long id, String resolution, Long resolvedById) {
        Dispute dispute = disputeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));

        User resolvedBy = userRepository.findById(resolvedById)
                .orElseThrow(() -> new RuntimeException("Resolver not found"));

        dispute.setStatus("RESOLVED");
        dispute.setResolution(resolution);
        dispute.setResolvedDate(LocalDateTime.now());
        dispute.setResolvedBy(resolvedBy);

        Dispute saved = disputeRepository.save(dispute);
        return mapToResponse(saved);
    }

    public DisputeResponse updateDisputeStatus(Long id, String status) {
        Dispute dispute = disputeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));

        dispute.setStatus(status);
        Dispute saved = disputeRepository.save(dispute);
        return mapToResponse(saved);
    }

    private DisputeResponse mapToResponse(Dispute dispute) {
        DisputeResponse response = new DisputeResponse();
        response.setId(dispute.getId());
        response.setOrderId(dispute.getOrder().getId());
        response.setReportedByName(dispute.getReportedBy().getName());
        response.setReportedByEmail(dispute.getReportedBy().getEmail());
        response.setReportedAgainstName(dispute.getReportedAgainst().getName());
        response.setReportedAgainstEmail(dispute.getReportedAgainst().getEmail());
        response.setReason(dispute.getReason());
        response.setDescription(dispute.getDescription());
        response.setStatus(dispute.getStatus());
        response.setResolution(dispute.getResolution());
        response.setCreatedDate(dispute.getCreatedDate());
        response.setResolvedDate(dispute.getResolvedDate());
        if (dispute.getResolvedBy() != null) {
            response.setResolvedByName(dispute.getResolvedBy().getName());
        }
        return response;
    }
}
