import React, { useState, useEffect, useCallback } from 'react';
import AdminService from '../services/AdminService';
import meshBg from '../assets/dashboard-mesh.png';

const FarmerVerification = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadPendingFarmers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await AdminService.getPendingFarmers();
      setFarmers(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load pending farmers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPendingFarmers();
  }, [loadPendingFarmers]);

  const handleVerifyFarmer = async (farmerId) => {
    try {
      setProcessing(true);
      await AdminService.verifyFarmer(farmerId);
      setFarmers(farmers.filter(f => f.id !== farmerId));
      setError('');
    } catch (err) {
      setError('Failed to verify farmer');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectFarmer = async (farmerId) => {
    if (!rejectReason.trim()) return;

    try {
      setProcessing(true);
      await AdminService.rejectFarmer(farmerId, rejectReason);
      setFarmers(farmers.filter(f => f.id !== farmerId));
      setSelectedFarmerId(null);
      setShowRejectForm(false);
      setRejectReason('');
      setError('');
    } catch (err) {
      setError('Failed to reject farmer');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-farmx-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Querying Verification Protocol...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Background Layer */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${meshBg})`, backgroundSize: 'cover' }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
              <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Compliance Queue</span>
            </div>
            <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
              Farmer <span className="text-farmx-green">Audits</span>.
            </h1>
          </div>
          <button
            onClick={loadPendingFarmers}
            className="bg-white text-farmx-dark px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl border border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition-all"
          >
            Sync Data
            <svg className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="glass-card bg-red-50/50 border border-red-200 p-6 rounded-[2rem] mb-12 flex justify-between items-center text-red-700 animate-slide-up">
            <span className="font-black text-sm uppercase tracking-widest flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Input Error: {error}
            </span>
            <button onClick={() => setError('')} className="font-black hover:scale-110 transition-transform">×</button>
          </div>
        )}

        {farmers.length === 0 ? (
          <div className="glass-card bg-white/40 border border-white/60 p-20 text-center rounded-[3rem] shadow-2xl animate-fade-in">
            <div className="text-8xl mb-8 opacity-20">🍃</div>
            <h3 className="text-3xl font-black text-farmx-dark">Clear Sector</h3>
            <p className="text-gray-400 font-bold mt-2 uppercase tracking-[0.2em] text-xs">All network nodes are currently verified.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {farmers.map((farmer, index) => (
              <div
                key={farmer.id}
                className="glass-card bg-white/40 border border-white/60 rounded-[2.5rem] shadow-2xl overflow-hidden group hover:shadow-farmx-green/5 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="px-10 py-8 border-b border-white/40 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-farmx-green to-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-farmx-green/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    {farmer.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-farmx-dark leading-tight">{farmer.name || farmer.farmName}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Registry Serial: 00{index + 1}-FXC</p>
                  </div>
                  <div className="bg-yellow-400/20 text-yellow-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-yellow-400/30">
                    Awaiting Validation
                  </div>
                </div>

                <div className="p-10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                      { l: 'Network Address', v: farmer.email, c: 'blue' },
                      { l: 'Comms Link', v: farmer.phoneNumber || 'NO LINK', c: 'emerald' },
                      { l: 'Territory Size', v: `${farmer.landArea || 0} ${farmer.landUnit || 'HA'}`, c: 'amber' },
                      { l: 'Sector Location', v: farmer.location || 'GLOBAL', c: 'indigo' }
                    ].map((idx, i) => (
                      <div key={i} className="bg-white/50 p-6 rounded-2xl border border-white/60 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{idx.l}</p>
                        <p className="text-sm font-black text-gray-900 truncate">{idx.v}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-100/50 p-6 rounded-2xl border border-gray-200 mb-8">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Farm Details</p>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-gray-700"><span className="text-gray-400">Primary Crop:</span> {farmer.primaryCrop || 'Not specified'}</p>
                      <p className="text-sm font-bold text-gray-700"><span className="text-gray-400">Soil Type:</span> {farmer.soilType || 'Not specified'}</p>
                      <p className="text-sm font-bold text-gray-700"><span className="text-gray-400">District:</span> {farmer.district || 'Not specified'}</p>
                      <p className="text-sm font-bold text-gray-700"><span className="text-gray-400">State:</span> {farmer.state || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handleVerifyFarmer(farmer.id)}
                      disabled={processing}
                      className="flex-1 relative group bg-farmx-green text-white py-5 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-farmx-green/20 hover:bg-farmx-green-dark transition-all overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {processing ? 'Processing...' : 'Authorize Node'}
                        <svg className="w-5 h-5 group-hover:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedFarmerId(farmer.id);
                        setShowRejectForm(!showRejectForm);
                      }}
                      disabled={processing}
                      className="relative group bg-white border border-red-100 text-red-600 py-5 px-10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-50 hover:border-red-200 transition-all"
                    >
                      Security Reject ✗
                    </button>
                  </div>

                  {selectedFarmerId === farmer.id && showRejectForm && (
                    <div className="mt-8 p-8 bg-red-50/50 backdrop-blur-md rounded-[2rem] border border-red-200 shadow-2xl animate-slide-up">
                      <label className="block text-[10px] font-black text-red-700 uppercase tracking-[0.3em] mb-4 text-center">Protocol Violation Reason</label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Define the specific security or compliance failure..."
                        className="w-full px-6 py-4 bg-white/80 border border-red-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-gray-900 font-bold placeholder-red-200"
                        rows="4"
                      />
                      <div className="mt-6 flex gap-4">
                        <button
                          onClick={() => handleRejectFarmer(farmer.id)}
                          disabled={processing || !rejectReason.trim()}
                          className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 transition-colors"
                        >
                          Confirm Termination
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFarmerId(null);
                            setShowRejectForm(false);
                            setRejectReason('');
                          }}
                          className="px-8 bg-white border border-gray-200 text-gray-400 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerVerification;
