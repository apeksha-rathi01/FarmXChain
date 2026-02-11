import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

class FarmerService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Profile Management
  getProfile() {
    return this.api.get('/farmers/profile');
  }

  createProfile(profileData) {
    return this.api.post('/farmers/profile', profileData);
  }

  updateProfile(profileData) {
    return this.api.put('/farmers/profile', profileData);
  }

  // Farm Details
  getFarmDetails() {
    return this.api.get('/farmers/farm-details');
  }

  updateFarmDetails(farmData) {
    return this.api.put('/farmers/farm-details', farmData);
  }

  // Farmer Listing
  getAllFarmers(filters = {}) {
    return this.api.get('/farmers', { params: filters });
  }

  getFarmersByCrop(cropType) {
    return this.api.get('/farmers/search/by-crop', { params: { crop: cropType } });
  }

  getFarmerById(farmerId) {
    return this.api.get(`/farmers/${farmerId}`);
  }

  // Verification Status
  getVerificationStatus() {
    return this.api.get('/farmers/verification/status');
  }

  // Documents
  uploadDocument(farmerId, file, documentType) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    return this.api.post(`/farmers/${farmerId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  getDocuments(farmerId) {
    return this.api.get(`/farmers/${farmerId}/documents`);
  }
}

const farmerService = new FarmerService();
export default farmerService;
