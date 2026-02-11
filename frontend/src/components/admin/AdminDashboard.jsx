import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { farmerService } from '../../api/farmerService';
import { adminService } from '../../api/adminService';
import { analyticsService } from '../../api/analyticsService';
import { getStatusBadgeColor } from '../../utils/helpers';
import meshBg from '../../assets/dashboard-mesh.png';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFarmers: 0,
    pendingFarmers: 0,
    totalCrops: 0,
    totalUsers: 0
  });
  const [farmers, setFarmers] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [farmersRes, usersRes, reportsRes, systemStatsRes] = await Promise.all([
        farmerService.getAllFarmers(),
        adminService.getAllUsers(),
        adminService.getAllReports(),
        analyticsService.getSystemAnalytics()
      ]);

      setFarmers(farmersRes.data || []);
      setUsers(usersRes.data || []);
      setReports(reportsRes.data || []);

      setStats({
        totalFarmers: farmersRes.data.length,
        pendingFarmers: farmersRes.data.filter((f) => f.status === 'PENDING').length,
        totalCrops: systemStatsRes.data.totalCrops,
        totalUsers: systemStatsRes.data.totalUsers
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFarmer = async (farmerId) => {
    try {
      await farmerService.approveFarmer(farmerId);
      fetchData();
    } catch (error) {
      console.error('Error approving farmer:', error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      await adminService.generateReport();
      fetchData();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      if (currentStatus === 'ACTIVE') {
        await adminService.suspendUser(userId);
      } else {
        await adminService.activateUser(userId);
      }
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-farmx-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing System Core...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans pb-12">
      {/* Background Layer */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${meshBg})`, backgroundSize: 'cover' }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
            <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">System Intelligence</span>
          </div>
          <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
            Admin <span className="text-farmx-green">Nexus</span>.
          </h1>
          <p className="text-gray-500 font-bold text-lg mt-2">Overseeing the FarmXChain ecosystem.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Users', val: stats.totalUsers, icon: '👥', color: 'border-purple-500' },
            { label: 'Farmers', val: stats.totalFarmers, icon: '👨‍🌾', color: 'border-blue-500' },
            { label: 'Pending Audit', val: stats.pendingFarmers, icon: '⏳', color: 'border-yellow-500' },
            { label: 'Crops Listed', val: stats.totalCrops, icon: '🌾', color: 'border-farmx-green' }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 bg-white/50 rounded-[2rem] border-t-4 border-white shadow-xl">
              <div className={`p-2 rounded-full w-fit mb-2 ${stat.color.replace('border', 'bg').replace('500', '100')}`}>{stat.icon}</div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-farmx-dark">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Report Generation */}
          <div className="glass-card p-8 bg-white/40 rounded-[2.5rem] shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-farmx-dark">System Reports</h2>
              <button onClick={handleGenerateReport} className="px-6 py-3 bg-farmx-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-farmx-green transition-all">
                Generate New
              </button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {reports.map(report => (
                <div key={report.id} className="p-4 bg-white/60 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-farmx-dark">{report.title}</p>
                    <p className="text-xs text-gray-400">{new Date(report.generatedDate).toLocaleDateString()} • {report.type}</p>
                  </div>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">ID: {report.id}</span>
                </div>
              ))}
              {reports.length === 0 && <p className="text-center text-gray-400 italic">No reports generated yet</p>}
            </div>
          </div>

          {/* User Governance */}
          <div className="glass-card p-8 bg-white/40 rounded-[2.5rem] shadow-xl">
            <h2 className="text-2xl font-black text-farmx-dark mb-6">User Governance</h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {users.slice(0, 10).map(u => (
                <div key={u.id} className="flex justify-between items-center p-4 bg-white/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${u.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-bold text-sm text-farmx-dark">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.role}</p>
                    </div>
                  </div>
                  {u.role !== 'ADMIN' && (
                    <button
                      onClick={() => handleToggleUserStatus(u.id, u.status)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.status === 'ACTIVE' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                      {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Farmers Section */}
        <div className="glass-card overflow-hidden shadow-2xl border border-white/60 bg-white/40 rounded-[2.5rem]">
          <div className="px-10 py-8 border-b border-white/40 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-farmx-dark">Farmer Protocols</h2>
              <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Manage access control</p>
            </div>
            <div className="bg-farmx-green/10 text-farmx-green px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
              Live Feed
            </div>
          </div>

          {farmers.length === 0 ? (
            <div className="p-20 text-center">
              <div className="text-6xl mb-6 opacity-20">🌱</div>
              <p className="text-xl font-black text-farmx-dark">Sector empty</p>
              <p className="text-gray-400 font-bold mt-2">No farmers have requested network access yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identity</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Communication</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Protocol Status</th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40">
                  {farmers.slice(0, 10).map((farmer, index) => (
                    <tr
                      key={farmer.id}
                      className="hover:bg-white/50 transition-colors duration-300"
                    >
                      <td className="px-10 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-farmx-green to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                            {farmer.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-farmx-dark">{farmer.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Node ID: #{farmer.id?.toString().slice(-4)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap">
                        <p className="text-sm font-bold text-gray-600">{farmer.email}</p>
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadgeColor(farmer.status)}`}>
                          {farmer.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 whitespace-nowrap">
                        {farmer.status === 'PENDING' ? (
                          <button
                            onClick={() => handleApproveFarmer(farmer.id)}
                            className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-farmx-green text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-farmx-green-dark transition-all duration-300 shadow-xl shadow-farmx-green/20"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              Authorize <span>✓</span>
                            </span>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-400">
                            <svg className="w-4 h-4 text-farmx-green" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">Node Verified</span>
                          </div>
                        ) || (
                          <span className="text-xs text-gray-500 font-semibold">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

