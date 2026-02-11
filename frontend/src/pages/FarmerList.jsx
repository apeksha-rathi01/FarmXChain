import React, { useState, useEffect, useCallback } from 'react';
import FarmerService from '../services/FarmerService';

const FarmerCard = ({ farmer, onViewDetails }) => (
  <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
        {farmer.name?.charAt(0)?.toUpperCase() || 'F'}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900">{farmer.name || farmer.farmName}</h3>
        <p className="text-xs text-gray-600">👨‍🌾 Verified Farmer</p>
      </div>
    </div>

    <div className="p-6">
      <p className="text-sm text-gray-600 mb-4">📧 {farmer.email}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">Farm Size</p>
          <p className="text-sm font-bold text-gray-900 mt-1">🌾 {farmer.farmSize || 'N/A'} acres</p>
        </div>
        <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">Phone</p>
          <p className="text-sm font-bold text-gray-900 mt-1">☎️ {farmer.phone || 'N/A'}</p>
        </div>
      </div>

      <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 mb-4">
        <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">📍 Location</p>
        <p className="text-sm font-bold text-gray-900 mt-1">{farmer.location || 'Not specified'}</p>
      </div>

      {farmer.crops && farmer.crops.length > 0 && (
        <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 mb-4">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">Crops</p>
          <div className="flex flex-wrap gap-2">
            {farmer.crops.map((crop, idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-purple-500 text-white">
                🌱 {crop}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => onViewDetails(farmer)}
        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 px-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        👁️ View Details
      </button>
    </div>
  </div>
);

const FarmerDetails = ({ farmer, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
      <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">👨‍🌾 {farmer.name || farmer.farmName}</h2>
        <button onClick={onClose} className="text-white hover:bg-primary-700 p-2 rounded-lg transition-all transform hover:scale-110">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Email</p>
            <p className="text-base font-semibold text-gray-900 mt-2">📧 {farmer.email}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Phone</p>
            <p className="text-base font-semibold text-gray-900 mt-2">☎️ {farmer.phone || 'N/A'}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Farm Size</p>
            <p className="text-base font-semibold text-gray-900 mt-2">🌾 {farmer.farmSize || 'N/A'} acres</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600 font-bold uppercase tracking-wide">Location</p>
            <p className="text-base font-semibold text-gray-900 mt-2">📍 {farmer.location || 'Not specified'}</p>
          </div>
        </div>

        {farmer.description && (
          <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-300">
            <p className="text-sm text-gray-600 font-bold uppercase tracking-wide mb-3">📝 Description</p>
            <p className="text-base text-gray-900 leading-relaxed">{farmer.description}</p>
          </div>
        )}

        {farmer.crops && farmer.crops.length > 0 && (
          <div className="mb-6 p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border-2 border-primary-300">
            <p className="text-sm text-gray-600 font-bold uppercase tracking-wide mb-3">🌱 Growing Crops</p>
            <div className="flex flex-wrap gap-3">
              {farmer.crops.map((crop, idx) => (
                <span key={idx} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-primary-600 text-white shadow-md">
                  🌾 {crop}
                </span>
              ))}
            </div>
          </div>
        )}

        {farmer.certifications && farmer.certifications.length > 0 && (
          <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-300">
            <p className="text-sm text-gray-600 font-bold uppercase tracking-wide mb-3">🏆 Certifications</p>
            <ul className="space-y-2">
              {farmer.certifications.map((cert, idx) => (
                <li key={idx} className="flex items-start gap-3 p-2 bg-white rounded-lg">
                  <svg className="h-6 w-6 text-green-600 mt-0 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-900 font-semibold">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [crops, setCrops] = useState([]);

  const loadFarmers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await FarmerService.getAllFarmers({ status: 'VERIFIED' });
      const farmersList = response.data || [];
      setFarmers(farmersList);
      setFilteredFarmers(farmersList);

      // Extract unique crops
      const uniqueCrops = new Set();
      farmersList.forEach(farmer => {
        if (farmer.crops && Array.isArray(farmer.crops)) {
          farmer.crops.forEach(crop => uniqueCrops.add(crop));
        }
      });
      setCrops(Array.from(uniqueCrops).sort());
      setError('');
    } catch (err) {
      setError('Failed to load farmers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFarmers();
  }, [loadFarmers]);

  useEffect(() => {
    let filtered = farmers;

    if (searchTerm) {
      filtered = filtered.filter(farmer =>
        farmer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.farmName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCrop) {
      filtered = filtered.filter(farmer =>
        farmer.crops && farmer.crops.includes(selectedCrop)
      );
    }

    setFilteredFarmers(filtered);
  }, [searchTerm, selectedCrop, farmers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-100 animate-spin">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 font-semibold mt-4">Loading verified farmers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Browse Farmers</h1>
            <p className="text-lg text-gray-600 mt-2">Find <span className="font-bold text-primary-600">verified</span> farmers in your area</p>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-4"></div>
          </div>
          <button
            onClick={loadFarmers}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex justify-between items-center shadow-md">
            <span className="font-semibold">⚠️ {error}</span>
            <button onClick={() => setError('')} className="text-red-600 hover:text-red-800 text-2xl leading-none">×</button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔍</span> Search & Filter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by name, email, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold text-sm transition-all"
            />

            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold text-sm transition-all"
            >
              <option value="">🌾 All Crops</option>
              {crops.map(crop => (
                <option key={crop} value={crop}>🌱 {crop}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredFarmers.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-16 text-center border border-gray-100">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Farmers Found</h3>
            <p className="text-gray-600 font-semibold">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-700 mb-6 font-semibold">
              Showing <span className="bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 rounded-lg font-bold text-primary-600">{filteredFarmers.length}</span> farmer(s)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFarmers.map((farmer) => (
                <FarmerCard
                  key={farmer.id}
                  farmer={farmer}
                  onViewDetails={(f) => setSelectedFarmer(f)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedFarmer && (
        <FarmerDetails
          farmer={selectedFarmer}
          onClose={() => setSelectedFarmer(null)}
        />
      )}
    </div>
  );
};

export default FarmerList;
