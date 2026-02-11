package com.farmxchain.backend.service;

import com.farmxchain.backend.dto.OrderDTO;
import com.farmxchain.backend.model.*;
import com.farmxchain.backend.repository.CropRepository;
import com.farmxchain.backend.repository.OrderRepository;
import com.farmxchain.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private PaymentService paymentService;

    @Transactional
    public Order createOrder(OrderDTO orderDTO, Long buyerId) {
        Crop crop = cropRepository.findById(orderDTO.getCropId())
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        if (!crop.getAvailableForSale()) {
            throw new RuntimeException("Crop is not available for sale");
        }

        if (crop.getAvailableQuantity() < orderDTO.getQuantity()) {
            throw new RuntimeException("Insufficient quantity available");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        User seller = userRepository.findById(orderDTO.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        // strict supply chain flow validation
        Role buyerRole = buyer.getRole();
        Role sellerRole = seller.getRole();

        if (sellerRole == Role.FARMER) {
            if (buyerRole != Role.DISTRIBUTOR) {
                throw new RuntimeException("Farmers can only sell to Distributors.");
            }
        } else if (sellerRole == Role.DISTRIBUTOR) {
            if (buyerRole != Role.RETAILER) {
                throw new RuntimeException("Distributors can only sell to Retailers.");
            }
        } else if (sellerRole == Role.RETAILER) {
            if (buyerRole != Role.CONSUMER) {
                throw new RuntimeException("Retailers can only sell to Consumers.");
            }
        } else {
            throw new RuntimeException("Invalid seller role for this transaction.");
        }

        Order order = new Order(crop, buyer, seller, orderDTO.getQuantity(), orderDTO.getPricePerUnit());
        order.setStatus(OrderStatus.REQUESTED);

        return orderRepository.save(order);
    }

    @Transactional
    public Order acceptOrder(Long orderId, Long sellerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: Only the seller can accept this order");
        }

        if (order.getStatus() != OrderStatus.REQUESTED) {
            throw new RuntimeException("Order cannot be accepted in current status");
        }

        order.setStatus(OrderStatus.ACCEPTED);
        order.setAcceptedDate(LocalDateTime.now());

        // Update available quantity
        Crop crop = order.getCrop();
        crop.setAvailableQuantity(crop.getAvailableQuantity() - order.getQuantity());
        
        // If depleted, mark not available
        if (crop.getAvailableQuantity() <= 0) {
            crop.setAvailableForSale(false);
            crop.setAvailableQuantity(0.0);
        }
        
        cropRepository.save(crop);

        // ✅ Blockchain Ownership Transfer Logic moved here
        try {
            // In a real app, this would use the buyer's actual wallet address
            // For now, we mock it or generate a derived one
            String buyerWallet = "0x" + Long.toHexString(order.getBuyer().getId() + 1000000);
            
            // Only transferring 'proof' ownership via crop ID
            blockchainService.transferOwnership(order.getCrop().getId(), buyerWallet);
            
            // Generate a simple hash of this transaction for tracking
            String proofHash = "0x" + UUID.randomUUID().toString().replace("-", "") + Long.toHexString(System.currentTimeMillis());
            order.setBlockchainTransactionHash(proofHash);
            
        } catch (Exception e) {
            // Log but don't fail the transaction for now (simulating network resilience)
            System.err.println("Blockchain ownership transfer failed: " + e.getMessage());
            // In production, we might want to retry or throw exception
            order.setBlockchainTransactionHash("PENDING_RETRY_" + System.currentTimeMillis()); 
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order rejectOrder(Long orderId, Long sellerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: Only the seller can reject this order");
        }

        if (order.getStatus() != OrderStatus.REQUESTED) {
            throw new RuntimeException("Order cannot be rejected in current status");
        }

        order.setStatus(OrderStatus.REJECTED);
        return orderRepository.save(order);
    }

    @Transactional
    public Order markAsShipped(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
                
        if (order.getStatus() != OrderStatus.ACCEPTED) {
            throw new RuntimeException("Order must be ACCEPTED before shipping");
        }
        
        order.setStatus(OrderStatus.SHIPPED);
        return orderRepository.save(order);
    }

    @Transactional
    public Order markAsDelivered(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.SHIPPED) {
             // Dependencies on flow, maybe allow from ACCEPTED? But plan said SHIPPED -> DELIVERED
             // Let's stick to strict flow for now
            throw new RuntimeException("Order must be SHIPPED before delivery");
        }

        order.setStatus(OrderStatus.DELIVERED);
        
        // --- INVENTORY SPLIT LOGIC START ---
        // Instead of moving the original crop, we create a NEW crop batch for the buyer
        Crop originalCrop = order.getCrop();
        
        // 1. Create new crop entity for the buyer
        Crop buyerCrop = new Crop();
        buyerCrop.setCropName(originalCrop.getCropName());
        buyerCrop.setCropType(originalCrop.getCropType());
        buyerCrop.setDescription(originalCrop.getDescription());
        buyerCrop.setUnit(originalCrop.getUnit());
        buyerCrop.setSoilType(originalCrop.getSoilType());
        buyerCrop.setLocation("Buyer Location"); // Placeholder as User entity lacks address field
        buyerCrop.setHarvestDate(originalCrop.getHarvestDate());
        buyerCrop.setCertificatePath(originalCrop.getCertificatePath());
        
        // Set quantities for the new batch
        buyerCrop.setQuantity(order.getQuantity());
        buyerCrop.setAvailableQuantity(order.getQuantity()); // Initially full amount is available to them
        buyerCrop.setAvailableForSale(false); // Default to not selling yet
        
        // Set ownership
        buyerCrop.setFarmerId(originalCrop.getFarmerId()); // Preserve origin
        buyerCrop.setCurrentOwnerId(order.getBuyer().getId()); // New owner
        
        // Set status based on buyer role
        if (order.getBuyer().getRole() == Role.DISTRIBUTOR) {
            buyerCrop.setStatus("IN_DISTRIBUTION");
        } else if (order.getBuyer().getRole() == Role.RETAILER) {
            buyerCrop.setStatus("AT_RETAIL");
        } else if (order.getBuyer().getRole() == Role.CONSUMER) {
            buyerCrop.setStatus("SOLD");
        } else {
            buyerCrop.setStatus("SOLD");
        }
        
        // Link blockchain trace (simple link for now)
        buyerCrop.setBlockchainHash("SPLIT-FROM-" + originalCrop.getId() + "-" + System.currentTimeMillis());
        
        cropRepository.save(buyerCrop);
        
        // 2. Update the Order to reference the NEW crop? 
        // Ideally we should, but that might break history if we change the crop ID on the order record.
        // For traceability, the Order should probably point to the SOURCE crop (which it does).
        // But the Buyer's inventory should show the NEW crop.
        // We will leave the Order pointing to the SOURCE crop to maintain the "audit trail" of where it came from.
        // The Buyer's "My Orders" will show the source. Their "My Inventory" (if we build it) will show the new crop.
        
        // 3. Ensure original crop stays with Seller 
        // We already reduced its availableQuantity in acceptOrder.
        // We do NOT change its currentOwnerId.
        // Just save it to be safe (though no changes needed if acceptOrder did its job).
        if (originalCrop.getAvailableQuantity() <= 0) {
             originalCrop.setStatus("SOLD_OUT");
        }
        cropRepository.save(originalCrop);
        // --- INVENTORY SPLIT LOGIC END ---

        return orderRepository.save(order);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getOrdersByBuyer(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }

    public List<Order> getOrdersBySeller(Long sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }

    public List<Order> getPendingOrdersForSeller(Long sellerId) {
        // Updated to use REQUESTED status
        return orderRepository.findBySellerIdAndStatus(sellerId, OrderStatus.REQUESTED);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
