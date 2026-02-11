import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from '../services/AdminService';
import meshBg from '../assets/dashboard-mesh.png';

const StatCard = ({ title, value, icon, color, label }) => (
  <div className="glass-card p-1 shadow-xl hover:shadow-farmx-green/10 transition-all duration-500 group">
    <div className="bg-white/40 p-8 rounded-[1.5rem] border border-white/50 h-full">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="text-xs font-black text-gray-400 bg-gray-100/50 px-3 py-1 rounded-full uppercase tracking-widest">{label}</div>
      </div>
      <p className="text-5xl font-black text-farmx-dark mb-1 tracking-tighter">{value}</p>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">{title}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    pendingVerifications: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadStatistics = useCallback(async () => {
    try {
      const [farmersData, usersData, pendingFarmersData] = await Promise.all([
        AdminService.getTotalFarmersCount(),
        AdminService.getTotalUsersCount(),
        AdminService.getPendingFarmers()
      ]);
      setStats({
        totalFarmers: farmersData.data || 0,
        totalUsers: usersData.data || 0,
        pendingVerifications: pendingFarmersData.data ? pendingFarmersData.data.length : 0,
        activeUsers: usersData.data || 0
      });
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-farmx-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Governance Layer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans pb-12">
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${meshBg})`, backgroundSize: 'cover' }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="mb-12 animate-fade-in flex justify-between items-end">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
              <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">System Intelligence</span>
            </div>
            <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
              Admin <span className="text-farmx-green">Nexus</span>.
            </h1>
            <p className="text-gray-500 font-bold text-lg mt-2">Overseeing the FarmXChain ecosystem.</p>
          </div>
          <button
            onClick={loadStatistics}
            className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xl hover:bg-gray-50 transition-all active:scale-95"
          >
            <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50/50 backdrop-blur-sm border border-red-200 text-red-700 px-6 py-4 rounded-3xl mb-8 font-bold flex justify-between items-center">
            <span>⚠️ {error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            label="Ecosystem"
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>}
            color="bg-blue-600"
          />
          <StatCard
            title="Total Farmers"
            value={stats.totalFarmers}
            label="Producers"
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            color="bg-farmx-green"
          />
          <StatCard
            title="Awaiting Audit"
            value={stats.pendingVerifications}
            label="Compliance"
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="bg-amber-500"
          />
          <StatCard
            title="Network Nodes"
            value={stats.activeUsers}
            label="Growth"
            icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            color="bg-indigo-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card bg-white/40 border border-white/60 p-8 rounded-[2.5rem] shadow-xl">
            <h2 className="text-2xl font-black text-farmx-dark mb-8">Governance Operations</h2>
            <div className="space-y-4">
              {[
                { label: 'Farmer Protocols', icon: '⚖️', path: '/farmer-verification', desc: 'Execute compliance checks on network nodes.' },
                { label: 'User Logic', icon: '👥', path: '/user-management', desc: 'Secure management of role-based identities.' },
                { label: 'Smart Contracts', icon: '🔗', path: '/blockchain-monitor', desc: 'Monitor ledger health and interaction logs.' },
                { label: 'Ecosystem Vault', icon: '📊', path: '/dashboard/crops', desc: 'Audit all blockchain-backed agriculture units.' },
                { label: 'Network Analytics', icon: '📈', path: '/statistics', desc: 'Visualize platform expansion vectors.' }
              ].map((op, i) => (
                <button
                  key={i}
                  onClick={() => navigate(op.path)}
                  className="w-full flex items-center justify-between p-6 rounded-3xl bg-white/80 border border-gray-100 hover:border-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-6 text-left">
                    <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{op.icon}</span>
                    <div>
                      <p className="font-black text-farmx-dark group-hover:text-slate-800">{op.label}</p>
                      <p className="text-xs font-bold text-gray-400">{op.desc}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl bg-slate-900 min-h-[400px]">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="relative z-10 p-12 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-black text-white mb-6">Network Health Optimization</h3>
                <p className="text-gray-400 font-medium text-lg leading-relaxed">
                  The FarmXChain protocol depends on rigorous verification. Ensure all nodes comply with the transparency standards to maintain ecosystem integrity.
                </p>
              </div>
              <div className="bg-farmx-green/10 border border-farmx-green/20 p-6 rounded-3xl">
                <p className="text-xs font-black text-farmx-green uppercase tracking-widest mb-1">Security Alert</p>
                <p className="text-white font-bold">Network operating at 100% efficiency. No anomalies detected.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default AdminDashboard;
