package com.farmxchain.backend.repository;

import com.farmxchain.backend.model.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByStatus(String status);
    List<Dispute> findByReportedById(Long userId);
    List<Dispute> findByOrderId(Long orderId);
    List<Dispute> findByReportedByIdOrReportedAgainstId(Long reportedById, Long reportedAgainstId);
}
