
package com.farmxchain.backend.repository;

import com.farmxchain.backend.model.Farmer;
import com.farmxchain.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {
    List<Farmer> findByApprovedFalse();
    Optional<Farmer> findByUser(User user);
}
