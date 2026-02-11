package com.farmxchain.backend.service;

import com.farmxchain.backend.model.Order;
import com.farmxchain.backend.model.Payment;
import com.farmxchain.backend.model.PaymentStatus;
import com.farmxchain.backend.repository.OrderRepository;
import com.farmxchain.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Payment processPayment(Long orderId, String paymentMethod, java.math.BigDecimal amount) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (paymentRepository.findByOrderId(orderId).isPresent()) {
            throw new RuntimeException("Payment already exists for this order");
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(amount);
        payment.setInitiatedAt(LocalDateTime.now());
        payment.setCompletedAt(LocalDateTime.now());
        payment.setStatus(PaymentStatus.COMPLETED);
        
        // Generate blockchain transaction hash as proof per Milestone 3
        String blockchainProof = "0x" + UUID.randomUUID().toString().replace("-", "").toLowerCase() + 
                                UUID.randomUUID().toString().replace("-", "").toLowerCase();
        payment.setTransactionId(blockchainProof);
        
        payment.setPaymentGateway("FarmX-Gateway-v1");
        payment.setPaymentMethod(paymentMethod != null ? paymentMethod : "UPI");
        
        return paymentRepository.save(payment);
    }

    public Payment getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElse(null);
    }
}
