import api from '../api/axios';

const AnalyticsService = {
    // Farmer Analytics
    getFarmerAnalytics: () => {
        return api.get('/analytics/farmer');
    },

    // Admin Analytics
    getSystemAnalytics: () => {
        return api.get('/analytics/system');
    },

    getDemandTrends: () => {
        return api.get('/analytics/demand-trends');
    },

    getPricingTrends: () => {
        return api.get('/analytics/pricing-trends');
    },

    getSupplyChainMetrics: () => {
        return api.get('/analytics/supply-chain');
    },

    // Distributor Analytics
    getDistributorAnalytics: () => {
        return api.get('/analytics/distributor');
    },

    // Retailer Analytics
    getRetailerAnalytics: () => {
        return api.get('/analytics/retailer');
    },

    // Public Traceability
    getCropJourney: (cropId) => {
        return api.get(`/public/trace/${cropId}`);
    }
};

export default AnalyticsService;
