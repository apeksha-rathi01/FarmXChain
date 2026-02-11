import api from './axios';

export const adminService = {
  // Reports
  generateReport: () => api.post('/admin/reports/generate'),
  getAllReports: () => api.get('/admin/reports'),

  // Users
  getAllUsers: () => api.get('/admin/users'),
  verifyUser: (id) => api.post(`/admin/users/${id}/verify`),
  suspendUser: (id) => api.post(`/admin/users/${id}/suspend`),
  activateUser: (id) => api.post(`/admin/users/${id}/activate`),

  // Stats
  getFarmerCount: () => api.get('/admin/stats/farmers/count'),
  getUserCount: () => api.get('/admin/stats/users/count'),
};
