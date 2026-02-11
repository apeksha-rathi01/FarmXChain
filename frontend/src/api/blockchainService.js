import api from './axios';

export const blockchainService = {
  // Blockchain Registration
  registerCropOnBlockchain: (cropData) => {
    return api.post('/blockchain/register-crop', cropData);
  },

  // Get blockchain record
  getBlockchainRecord: (cropId) => {
    return api.get(`/blockchain/crop/${cropId}`);
  },

  // Get blockchain hash
  getBlockchainHash: (cropId) => {
    return api.get(`/blockchain/crop/${cropId}/hash`);
  },

  // Verify blockchain data
  verifyCropData: (cropId) => {
    return api.get(`/blockchain/crop/${cropId}/verify`);
  },

  // Get traceability records
  getTraceability: (cropId) => {
    return api.get(`/blockchain/crop/${cropId}/traceability`);
  },

  // Get crop by blockchain hash
  getCropByBlockchainHash: (hash) => {
    return api.get(`/blockchain/crop-by-hash/${hash}`);
  },

  // Get all crop batches on blockchain
  getAllCropBatches: (filters = {}) => {
    return api.get('/blockchain/crop-batches', { params: filters });
  },

  // Record crop movement
  recordMovement: (cropId, movementData) => {
    return api.post(`/blockchain/crop/${cropId}/movement`, movementData);
  },

  // Get blockchain stats
  getBlockchainStats: () => {
    return api.get('/blockchain/stats');
  },
};

export default blockchainService;
