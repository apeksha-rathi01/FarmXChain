import api from './axios';

export const orderService = {
    // Create order (Buyer)
    createOrder: (orderData) => {
        return api.post('/orders/create', orderData);
    },

    // Accept order (Farmer/Seller)
    acceptOrder: (orderId) => {
        return api.put(`/orders/${orderId}/accept`);
    },

    // Reject order (Farmer/Seller)
    rejectOrder: (orderId, reason) => {
        return api.put(`/orders/${orderId}/reject`, { reason });
    },

    // Cancel order (Buyer)
    cancelOrder: (orderId) => {
        return api.delete(`/orders/${orderId}/cancel`);
    },

    // Complete order
    completeOrder: (orderId) => {
        return api.put(`/orders/${orderId}/complete`);
    },

    // Get order by ID
    getOrderById: (orderId) => {
        return api.get(`/orders/${orderId}`);
    },

    // Get buyer's orders
    getMyPurchases: () => {
        return api.get('/orders/my-purchases');
    },

    // Get seller's orders
    getMySales: () => {
        return api.get('/orders/my-sales');
    },

    // Get pending orders for seller
    getPendingSales: () => {
        return api.get('/orders/pending-sales');
    },

    // Get all orders (Admin)
    getAllOrders: () => {
        return api.get('/orders/all');
    },
};

export default orderService;
