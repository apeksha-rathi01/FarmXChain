import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cropService } from '../../api/cropService';
import { farmerService } from '../../api/farmerService';
import meshBg from '../../assets/dashboard-mesh.png';

export default function CropForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cropName: '',
    cropType: '',
    quantity: '',
    unit: 'KG',
    harvestDate: '',
    soilType: '',
    location: '',
    description: '',
    availableForSale: false,
    pricePerUnit: '',
  });
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cropTypes = ['Wheat', 'Rice', 'Corn', 'Barley', 'Soybean', 'Cotton', 'Fruits', 'Vegetables'];
  const units = ['KG', 'TON', 'QUINTAL', 'BAGS'];

  useEffect(() => {
    checkApprovalStatus();
  }, []);

  const checkApprovalStatus = async () => {
    try {
      const response = await farmerService.getProfile();
      setIsApproved(response.data.approved);
    } catch (err) {
      console.error('Failed to check approval status:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCertificateChange = (e) => {
    setCertificate(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isApproved) return;

    setError('');
    setSuccess('');

    if (!formData.cropName || !formData.quantity || !formData.harvestDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const cropResponse = await cropService.createCrop({
        cropName: formData.cropName,
        cropType: formData.cropType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        harvestDate: formData.harvestDate,
        soilType: formData.soilType,
        location: formData.location,
        description: formData.description,
        availableForSale: formData.availableForSale,
        pricePerUnit: formData.pricePerUnit ? parseFloat(formData.pricePerUnit) : null,
      });

      const cropId = cropResponse.data.id;

      if (certificate) {
        await cropService.uploadCertificate(cropId, certificate);
      }

      setSuccess('Crop added successfully and registered on blockchain!');
      setFormData({
        cropName: '',
        cropType: '',
        quantity: '',
        unit: 'KG',
        harvestDate: '',
        soilType: '',
        location: '',
        description: '',
        availableForSale: false,
        pricePerUnit: '',
      });
      setCertificate(null);

      setTimeout(() => navigate('/dashboard/my-crops'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-farmx-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 relative z-10">
      <div className="flex items-center justify-between mb-12 animate-fade-in">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
            <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Registry Protocol</span>
          </div>
          <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
            Register <span className="text-farmx-green">New Harvest</span>.
          </h1>
        </div>
        <button
          onClick={() => navigate('/dashboard/my-crops')}
          className="text-xs font-black text-gray-400 hover:text-farmx-dark uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          ← Return to Vault
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {!isApproved ? (
            <div className="glass-card bg-amber-50/50 border border-amber-200 rounded-[3rem] p-12 text-center animate-slide-up">
              <div className="text-6xl mb-6">🔒</div>
              <h2 className="text-3xl font-black text-farmx-dark mb-4">Awaiting Admin Approval</h2>
              <p className="text-gray-600 font-bold mb-8">
                Your nodes are currently pending verification. Crop registration is restricted until the ecosystem audit is complete.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-farmx-dark text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
              >
                Return to Overview
              </button>
            </div>
          ) : (
            <div className="glass-card bg-white/40 border border-white/60 rounded-[3rem] shadow-2xl p-10 animate-slide-up">
              {error && (
                <div className="p-6 bg-red-50/50 border border-red-200 rounded-[2rem] mb-8 text-red-700 flex justify-between items-center">
                  <span className="font-black text-xs uppercase tracking-widest">⚠️ Protocol Error: {error}</span>
                  <button onClick={() => setError('')} className="font-black">×</button>
                </div>
              )}

              {success && (
                <div className="p-6 bg-farmx-green/10 border border-farmx-green/20 rounded-[2rem] mb-8 text-farmx-green flex justify-between items-center">
                  <span className="font-black text-xs uppercase tracking-widest">✓ Hash Verified: {success}</span>
                  <button onClick={() => setSuccess('')} className="font-black">×</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Harvest Name</label>
                    <input
                      type="text"
                      name="cropName"
                      value={formData.cropName}
                      onChange={handleChange}
                      placeholder="e.g. Premium Saffron Gold"
                      className="w-full bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all placeholder-gray-300"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Harvest Type</label>
                    <select
                      name="cropType"
                      value={formData.cropType}
                      onChange={handleChange}
                      className="w-full bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all"
                      disabled={loading}
                    >
                      <option value="">Matrix Category</option>
                      {cropTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Yield Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Measurement Scale</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all"
                      disabled={loading}
                    >
                      {units.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Harvest Timeline</label>
                    <input
                      type="date"
                      name="harvestDate"
                      value={formData.harvestDate}
                      onChange={handleChange}
                      className="w-full bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Substrate Identity</label>
                    <input
                      type="text"
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleChange}
                      placeholder="e.g. Volcanic Loam"
                      className="w-full bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Geographic Coordinates</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Field Sector 7G, Northern Highlands"
                    className="w-full bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Harvest Narrative</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all resize-none"
                    disabled={loading}
                  />
                </div>

                <div className="p-8 bg-farmx-green/5 border border-farmx-green/10 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-farmx-dark uppercase tracking-widest">Marketplace Listing</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Deploy this harvest to the commerce layer immediately</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="availableForSale"
                        checked={formData.availableForSale}
                        onChange={(e) => setFormData(p => ({ ...p, availableForSale: e.target.checked }))}
                        className="sr-only peer"
                        disabled={loading}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-farmx-green"></div>
                    </label>
                  </div>

                  {formData.availableForSale && (
                    <div className="animate-fade-in space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Price per {formData.unit || 'Unit'} (₹)</label>
                      <input
                        type="number"
                        name="pricePerUnit"
                        value={formData.pricePerUnit}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full bg-white border border-gray-100 p-5 rounded-2xl font-black text-farmx-green focus:border-farmx-green focus:outline-none transition-all placeholder-gray-200"
                        disabled={loading}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full bg-farmx-dark text-white p-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all shadow-2xl hover:shadow-farmx-green/20 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Encrypting Identity...
                        </>
                      ) : (
                        'Commit to Blockchain'
                      )}
                    </span>
                    <div className="absolute inset-0 bg-farmx-green translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card bg-farmx-green/5 border border-farmx-green/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-farmx-green/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-sm font-black text-farmx-dark uppercase tracking-widest mb-6">Verification Assets</h3>

            <div className="relative">
              <input
                type="file"
                id="certificate"
                accept=".pdf"
                onChange={handleCertificateChange}
                className="hidden"
                disabled={loading || !isApproved}
              />
              <label
                htmlFor="certificate"
                className={`block w-full border-2 border-dashed ${isApproved ? 'border-farmx-green/30 hover:border-farmx-green cursor-pointer' : 'border-gray-200 cursor-not-allowed'} p-8 rounded-[2rem] text-center transition-all hover:bg-white/40`}
              >
                <div className="text-4xl mb-4 opacity-50">📄</div>
                <p className="text-[10px] font-black text-farmx-green uppercase tracking-widest">
                  {certificate ? certificate.name : 'Upload Analysis Report'}
                </p>
                <p className="text-[9px] text-gray-400 mt-2 font-bold italic">ISO 22000 compliant PDF preferred</p>
              </label>
            </div>
          </div>

          <div className="glass-card bg-white/40 border border-white/60 p-8 rounded-[2.5rem]">
            <h3 className="text-sm font-black text-farmx-dark uppercase tracking-widest mb-4">Immutable Ledger</h3>
            <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">
              Every harvest record is cryptographically signed and stored on the decentralized network.
              <span className="text-farmx-green block mt-2 tracking-widest">Zero latency • Infinite trust • Global reach</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
