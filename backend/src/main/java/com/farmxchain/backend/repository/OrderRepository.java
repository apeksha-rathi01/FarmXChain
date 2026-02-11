package com.farmxchain.backend.repository;

import com.farmxchain.backend.model.Order;
import com.farmxchain.backend.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findBySellerId(Long sellerId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByBuyerIdAndStatus(Long buyerId, OrderStatus status);
    List<Order> findBySellerIdAndStatus(Long sellerId, OrderStatus status);
    List<Order> findByCropId(Long cropId);
}
