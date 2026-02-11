import api from '../api/axios';

const DisputeService = {
    // Create a new dispute
    createDispute: (disputeData) => {
        return api.post('/disputes', disputeData);
    },

    // Get all disputes (Admin only)
    getAllDisputes: () => {
        return api.get('/disputes');
    },

    // Get disputes by status
    getDisputesByStatus: (status) => {
        return api.get(`/disputes/status/${status}`);
    },

    // Get current user's disputes
    getMyDisputes: () => {
        return api.get('/disputes/my');
    },

    // Get dispute by ID
    getDisputeById: (id) => {
        return api.get(`/disputes/${id}`);
    },

    // Resolve dispute (Admin only)
    resolveDispute: (id, resolution) => {
        return api.put(`/disputes/${id}/resolve`, { resolution });
    },

    // Update dispute status
    updateDisputeStatus: (id, status) => {
        return api.put(`/disputes/${id}/status`, { status });
    }
};

export default DisputeService;
