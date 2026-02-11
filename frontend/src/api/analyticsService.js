import api from './axios';

export const analyticsService = {
    getFarmerAnalytics: () => api.get('/analytics/farmer'),
    getSystemAnalytics: () => api.get('/analytics/system'),
};
