import React, { useState, useEffect, useCallback } from 'react';
import AdminService from '../services/AdminService';

const StatBox = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:-translate-y-1">
    <div className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-3">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-2 font-semibold">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    verifiedFarmers: 0,
    pendingFarmers: 0,
    rejectedFarmers: 0,
    activeFarmers: 0,
    usersByRole: {},
    verificationStats: {},
    platformStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const [
        users,
        farmers,
        pending,
        verification,
        platform
      ] = await Promise.all([
        AdminService.getTotalUsersCount(),
        AdminService.getTotalFarmersCount(),
        AdminService.getPendingFarmers(),
        AdminService.getVerificationStats(),
        AdminService.getPlatformStats()
      ]);

      setStats({
        totalUsers: users.data || 0,
        totalFarmers: farmers.data || 0,
        pendingFarmers: pending.data ? pending.data.length : 0,
        verifiedFarmers: verification.data?.verified || 0,
        rejectedFarmers: verification.data?.rejected || 0,
        activeFarmers: platform.data?.activeFarmers || 0,
        usersByRole: platform.data?.usersByRole || {},
        verificationStats: verification.data || {},
        platformStats: platform.data || {}
      });
      setError('');
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-100 animate-spin">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 font-semibold mt-4">Loading statistics...</p>
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
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Platform Statistics</h1>
            <p className="text-lg text-gray-600 mt-2">Overview of <span className="font-bold text-primary-600">FarmX</span> platform metrics</p>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-4"></div>
          </div>
          <button
            onClick={loadStatistics}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            🔄 Refresh Stats
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 flex justify-between items-center shadow-md">
            <span className="font-semibold">⚠️ {error}</span>
            <button onClick={() => setError('')} className="text-red-600 hover:text-red-800 text-2xl leading-none">×</button>
          </div>
        )}

        {/* Main Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatBox
            title="Total Users"
            value={stats.totalUsers}
            icon={
              <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12a3 3 0 100-6 3 3 0 000 6zm0 2c-1.657 0-3 .895-3 2v1h6v-1c0-1.105-1.343-2-3-2z" />
              </svg>
            }
            color="bg-blue-100"
          />

          <StatBox
            title="Total Farmers"
            value={stats.totalFarmers}
            icon={
              <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            }
            color="bg-green-100"
          />

          <StatBox
            title="Active Farmers"
            value={stats.activeFarmers}
            icon={
              <svg className="h-8 w-8 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            color="bg-emerald-100"
          />

          <StatBox
            title="Pending Verification"
            value={stats.pendingFarmers}
            icon={
              <svg className="h-8 w-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            }
            color="bg-yellow-100"
          />
        </div>

        {/* Verification Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatBox
            title="Verified Farmers"
            value={stats.verifiedFarmers}
            subtitle="Successfully verified"
            icon={
              <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            }
            color="bg-green-100"
          />

          <StatBox
            title="Rejected Farmers"
            value={stats.rejectedFarmers}
            subtitle="Verification failed"
            icon={
              <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            }
            color="bg-red-100"
          />

          <StatBox
            title="Pending Verification"
            value={stats.pendingFarmers}
            subtitle="Awaiting review"
            icon={
              <svg className="h-8 w-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            }
            color="bg-yellow-100"
          />
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Role */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-2xl">👥</span>
                Users by Role
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {Object.entries(stats.usersByRole || {}).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:from-primary-50 hover:to-primary-50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full"></div>
                      <span className="text-gray-700 font-bold capitalize tracking-wide">{role}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 rounded-lg">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.usersByRole || {}).length === 0 && (
                  <p className="text-gray-500 text-center py-8 font-semibold">📊 No data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Platform Overview */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-2xl">📈</span>
                Platform Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all">
                  <span className="text-gray-700 font-bold">Total Registrations</span>
                  <span className="text-lg font-bold text-blue-600 bg-blue-200 px-4 py-2 rounded-lg">{stats.totalUsers + stats.totalFarmers}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all">
                  <span className="text-gray-700 font-bold">Verification Rate</span>
                  <span className="text-lg font-bold text-green-600 bg-green-200 px-4 py-2 rounded-lg">
                    {stats.totalFarmers > 0
                      ? Math.round((stats.verifiedFarmers / stats.totalFarmers) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg hover:from-yellow-100 hover:to-yellow-200 transition-all">
                  <span className="text-gray-700 font-bold">Pending Reviews</span>
                  <span className="text-lg font-bold text-yellow-600 bg-yellow-200 px-4 py-2 rounded-lg">{stats.pendingFarmers}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all">
                  <span className="text-gray-700 font-bold">Rejection Rate</span>
                  <span className="text-lg font-bold text-purple-600 bg-purple-200 px-4 py-2 rounded-lg">
                    {stats.totalFarmers > 0
                      ? Math.round((stats.rejectedFarmers / stats.totalFarmers) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
