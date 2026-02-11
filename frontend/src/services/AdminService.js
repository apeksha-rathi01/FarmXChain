import api from '../api/axios';

class AdminService {
  // Farmer Management
  getPendingFarmers() {
    return api.get('/admin/pending-farmers');
  }

  verifyFarmer(farmerId) {
    return api.put(`/admin/approve/${farmerId}`);
  }

  rejectFarmer(farmerId) {
    return api.delete(`/admin/reject/${farmerId}`);
  }

  // User Management
  getAllUsers() {
    return api.get('/admin/users');
  }

  verifyUser(userId) {
    return api.post(`/admin/users/${userId}/verify`);
  }

  suspendUser(userId) {
    return api.post(`/admin/users/${userId}/suspend`);
  }

  activateUser(userId) {
    return api.post(`/admin/users/${userId}/activate`);
  }

  // Statistics
  getTotalFarmersCount() {
    return api.get('/admin/stats/farmers/count');
  }

  getTotalUsersCount() {
    return api.get('/admin/stats/users/count');
  }

  // Data Auditing
  getAllOrders() {
    return api.get('/orders/all');
  }

  getAllCrops() {
    return api.get('/crops');
  }
}

const adminService = new AdminService();
export default adminService;
