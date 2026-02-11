package com.farmxchain.backend.repository;

import com.farmxchain.backend.model.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    java.util.List<Crop> findByFarmerId(Long farmerId);
    java.util.List<Crop> findByCurrentOwnerId(Long currentOwnerId);
    java.util.List<Crop> findByAvailableForSaleTrue();
}
