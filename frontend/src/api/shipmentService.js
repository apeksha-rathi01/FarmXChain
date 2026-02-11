import api from './axios';

export const shipmentService = {
    // Create shipment (Farmer)
    createShipment: (shipmentData) => {
        return api.post('/shipments/create', shipmentData);
    },

    // Update location
    updateLocation: (shipmentId, location) => {
        return api.put(`/shipments/${shipmentId}/location`, { location });
    },

    // Update IoT condition data
    updateCondition: (shipmentId, temperature, humidity) => {
        return api.put(`/shipments/${shipmentId}/condition`, { temperature, humidity });
    },

    // Update shipment status
    updateStatus: (shipmentId, status) => {
        return api.put(`/shipments/${shipmentId}/status`, { status });
    },

    // Get shipment by order ID
    getShipmentByOrder: (orderId) => {
        return api.get(`/shipments/order/${orderId}`);
    },

    // Get shipment by ID
    getShipmentById: (shipmentId) => {
        return api.get(`/shipments/${shipmentId}`);
    },

    // Track shipment by tracking number
    trackShipment: (trackingNumber) => {
        return api.get(`/shipments/track/${trackingNumber}`);
    },

    // Get all shipments (Admin)
    getAllShipments: () => {
        return api.get('/shipments/all');
    },

    // Get shipments by status
    getShipmentsByStatus: (status) => {
        return api.get(`/shipments/status/${status}`);
    },

    // Simulate movement
    simulateMovement: (shipmentId) => {
        return api.post(`/shipments/${shipmentId}/simulate`);
    },
};

export default shipmentService;
