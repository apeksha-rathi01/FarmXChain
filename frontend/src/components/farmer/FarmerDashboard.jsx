import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cropService } from '../../api/cropService';
import { farmerService } from '../../api/farmerService';
import { analyticsService } from '../../api/analyticsService';
import meshBg from '../../assets/dashboard-mesh.png';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCrops: 0,
    blockchaincertificates: 0,
    isApproved: false,
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    checkProfileAndFetchStats();
  }, []);

  const checkProfileAndFetchStats = async () => {
    try {
      // Check if farmer profile exists
      try {
        await farmerService.getProfile();
        setShowProfilePrompt(false);
      } catch (profileError) {
        // Profile doesn't exist, show prompt
        if (profileError.response?.status === 404 || profileError.response?.status === 500) {
          setShowProfilePrompt(true);
        }
      }
      setCheckingProfile(false);

      // Fetch stats
      await fetchStats();
    } catch (error) {
      console.error('Error during initialization:', error);
      setCheckingProfile(false);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [cropResponse, profileResponse, analyticsResponse] = await Promise.all([
        cropService.getMycrops(),
        farmerService.getProfile(),
        analyticsService.getFarmerAnalytics()
      ]);
      setStats({
        totalCrops: cropResponse.data.length,
        blockchaincertificates: cropResponse.data.filter(c => c.blockchainHash).length,
        isApproved: profileResponse.data.approved
      });
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-farmx-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Ecosystem...</p>
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
        {/* New Header Design */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
            <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Operational Overview</span>
          </div>
          <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
            Welcome, <span className="text-farmx-green">{user?.name?.split(' ')[0]}</span>.
          </h1>
          <p className="text-gray-500 font-bold text-lg mt-2">Your farm's blockchain pulse is healthy.</p>
        </div>

        {/* Analytics Section */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card bg-green-500 text-white p-8 rounded-[2.5rem] shadow-xl shadow-green-200">
              <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">Total Revenue</p>
              <h2 className="text-4xl font-black">₹{analytics.totalIncome}</h2>
            </div>
            <div className="glass-card bg-white p-8 rounded-[2.5rem] shadow-lg border border-gray-100">
              <p className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Total Sales</p>
              <h2 className="text-4xl font-black text-farmx-dark">{analytics.totalOrders} <span className="text-base text-gray-400">orders</span></h2>
            </div>
            <div className="glass-card bg-blue-500 text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-200">
              <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">Top Crop</p>
              <h2 className="text-2xl font-black mt-1">
                {Object.entries(analytics.salesByCrop || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </h2>
            </div>
          </div>
        )}

        {/* Profile Creation Prompt Modal */}
        {showProfilePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="glass-card bg-white/90 border border-white/60 rounded-[3rem] shadow-2xl max-w-2xl mx-4 p-12 animate-slide-up">
              <div className="text-center mb-8">
                <div className="text-6xl mb-6">🌾</div>
                <h2 className="text-4xl font-black text-farmx-dark mb-4">Complete Your Farm Identity</h2>
                <p className="text-gray-600 font-bold text-lg">
                  To access all features and register crops, please create your farmer profile first.
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/dashboard/profile')}
                  className="bg-farmx-green text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-farmx-green/20 hover:scale-105 transition-all"
                >
                  Create Profile Now
                </button>
                <button
                  onClick={() => setShowProfilePrompt(false)}
                  className="bg-gray-100 text-gray-700 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Remind Me Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Card 1 */}
          <div className="glass-card p-1 shadow-xl hover:shadow-farmx-green/10 transition-all duration-500 group">
            <div className="bg-white/40 p-8 rounded-[1.5rem] border border-white/50 h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-farmx-green/10 rounded-2xl group-hover:bg-farmx-green group-hover:text-white transition-all duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.782 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-xs font-black text-gray-400 bg-gray-100/50 px-3 py-1 rounded-full uppercase">Active Crops</div>
              </div>
              <p className="text-5xl font-black text-farmx-dark mb-1 tracking-tighter">{stats.totalCrops}</p>
              <p className="text-sm font-bold text-gray-400">Inventory managed</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-1 shadow-xl hover:shadow-blue-500/10 transition-all duration-500 group">
            <div className="bg-white/40 p-8 rounded-[1.5rem] border border-white/50 h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-blue-500/10 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div className="text-xs font-black text-blue-400 bg-blue-50 px-3 py-1 rounded-full uppercase">Verified</div>
              </div>
              <p className="text-5xl font-black text-farmx-dark mb-1 tracking-tighter">{stats.blockchaincertificates}</p>
              <p className="text-sm font-bold text-gray-400">Blockchain certificates</p>
            </div>
          </div>

          {/* Card 3 - Action Card */}
          <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl shadow-farmx-green/20">
            <div className="absolute inset-0 bg-gradient-to-br from-farmx-green to-emerald-700"></div>
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
              <svg className="w-32 h-32" fill="white" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div>
                <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-2">Platform Trust</p>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Your farm is <br />
                  <span className={`underline decoration-4 ${stats.isApproved ? 'decoration-lime-400' : 'decoration-amber-400'}`}>
                    {stats.isApproved ? 'Network Verified' : 'Awaiting Admin Approval'}
                  </span>.
                </h3>
              </div>
              <button
                onClick={() => navigate('/dashboard/profile')}
                className="w-full bg-white text-farmx-green py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-lime-50 transition-colors shadow-xl"
              >
                Manage Profile
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Actions & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 glass-card p-8 bg-white/40 border border-white/60 shadow-xl rounded-[2.5rem]">
            <h2 className="text-2xl font-black text-farmx-dark mb-8">Ecosystem Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Register New Crop', icon: '🌱', path: '/dashboard/add-crop', color: 'from-green-500 to-emerald-600' },
                { label: 'Inventory Logic', icon: '📋', path: '/dashboard/my-crops', color: 'from-blue-500 to-indigo-600' },
                { label: 'Blockchain Audit', icon: '⛓️', path: '/dashboard/traceability', color: 'from-purple-500 to-fuchsia-600' },
                { label: 'Identity Settings', icon: '👤', path: '/dashboard/profile', color: 'from-orange-500 to-amber-600' }
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="group relative flex items-center gap-6 p-6 rounded-3xl bg-white border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 overflow-hidden"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900 group-hover:text-farmx-green transition-colors">{action.label}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Execute Protocol</p>
                  </div>
                  <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-8">
            <div className="bg-farmx-dark p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-farmx-green/20 rounded-full blur-3xl group-hover:bg-farmx-green/30 transition-all duration-700"></div>
              <h3 className="text-xl font-black mb-4">Smart Network Tip</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">
                Registration on the blockchain ensures your produce is valued higher by distributors who prioritize 100% transparency and food safety.
              </p>
              <div className="flex items-center gap-2 text-xs font-black text-farmx-green uppercase tracking-widest cursor-pointer hover:translate-x-1 transition-transform">
                Read Documentation <span>→</span>
              </div>
            </div>

            <div className="bg-lime-400 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
              <h3 className="text-xl font-black text-farmx-dark mb-4">Sustainability Index</h3>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-black text-farmx-dark">94%</span>
                <span className="text-xs font-black text-farmx-dark/60 uppercase mb-1">Elite</span>
              </div>
              <div className="h-2 w-full bg-farmx-dark/10 rounded-full overflow-hidden">
                <div className="h-full bg-farmx-dark w-[94%] rounded-full animate-slide-right"></div>
              </div>
              <p className="text-[10px] font-black text-farmx-dark/60 uppercase tracking-widest mt-4">Calculated via FarmX Protocol</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
