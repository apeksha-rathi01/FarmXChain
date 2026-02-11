import api from './axios';

export const cropService = {
  // Crop Management
  getAllCrops: (filters = {}) => {
    return api.get('/crops', { params: filters });
  },

  getMarketplaceCrops: () => {
    return api.get('/crops/marketplace');
  },

  getMyInventory: () => {
    return api.get('/crops/my-inventory');
  },

  getCropById: (id) => {
    return api.get(`/crops/${id}`);
  },

  createCrop: (cropData) => {
    return api.post('/crops/add', cropData);
  },

  updateCrop: (id, cropData) => {
    return api.put(`/crops/${id}`, cropData);
  },

  deleteCrop: (id) => {
    return api.delete(`/crops/${id}`);
  },

  // Farmer crops
  getMycrops: () => {
    return api.get('/crops/my-crops');
  },

  // Quality certificates
  uploadCertificate: (cropId, certificateFile) => {
    const formData = new FormData();
    formData.append('file', certificateFile);
    return api.post(`/crops/${cropId}/certificate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getCertificate: (cropId) => {
    return api.get(`/crops/${cropId}/certificate`);
  },

  // Crop tracking
  getCropHistory: (cropId) => {
    return api.get(`/crops/${cropId}/history`);
  },

  updateListing: (id, listingData) => {
    return api.put(`/crops/${id}/list`, listingData);
  },
};

export default cropService;
