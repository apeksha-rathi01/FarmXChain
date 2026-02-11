import api from "./axios";

export const farmerService = {
  // Farmer Profile
  getProfile: () => {
    return api.get('/farmer/me');
  },

  createProfile: (profileData) => {
    return api.post('/farmer/create', profileData);
  },

  updateFarmDetails: (farmData) => {
    return api.put('/farmer/update', farmData);
  },

  // Farm Details (Alias to getProfile if needed, or distinct if implemented)
  getFarmDetails: () => {
    return api.get('/farmer/me');
  },

  // Get all farmers (for admin) uses Admin Controller usually, but if needed here:
  getAllFarmers: (filters = {}) => {
    return api.get('/admin/pending-farmers', { params: filters }); // Temporary mapping or usage of admin endpoint
  },

  // Get farmer by ID
  getFarmerById: (id) => {
    // Backend doesn't have public get by ID yet, likely for Distributor/Retailer later.
    // For now leaving as is or commenting out if unused.
    return api.get(`/farmer/${id}`); 
  },

  // Approve/Reject farmer (admin) - moved to adminService but keeping for compatibility if used
  approveFarmer: (id) => {
    return api.put(`/admin/approve/${id}`);
  },

  rejectFarmer: (id) => {
    return api.delete(`/admin/reject/${id}`);
  },
};

export default farmerService;
