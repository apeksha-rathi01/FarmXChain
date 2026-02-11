import React, { useState, useEffect } from 'react';
import AnalyticsService from '../services/AnalyticsService';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import meshBg from '../assets/dashboard-mesh.png';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function FarmerAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await AnalyticsService.getFarmerAnalytics();
            setAnalytics(response.data);
        } catch (err) {
            setError('Failed to load analytics data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-farmx-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-bold text-xl">{error}</p>
                </div>
            </div>
        );
    }

    // Prepare data for charts
    const salesByCropData = Object.entries(analytics?.salesByCrop || {}).map(([name, value]) => ({
        name,
        sales: value
    }));

    return (
        <div className="min-h-screen relative overflow-hidden font-sans pb-12">
            <div
                className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: `url(${meshBg})`, backgroundSize: 'cover' }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
                        <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Performance Insights</span>
                    </div>
                    <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
                        Farmer <span className="text-farmx-green">Analytics</span>.
                    </h1>
                    <p className="text-gray-500 font-bold text-lg mt-2">Track your sales performance and income</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="glass-card p-1 shadow-xl hover:shadow-farmx-green/10 transition-all duration-500 group">
                        <div className="bg-white/40 p-8 rounded-[1.5rem] border border-white/50 h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-green-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-xs font-black text-gray-400 bg-gray-100/50 px-3 py-1 rounded-full uppercase tracking-widest">Income</div>
                            </div>
                            <p className="text-5xl font-black text-farmx-dark mb-1 tracking-tighter">₹{analytics?.totalIncome || 0}</p>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">Total Earnings</p>
                        </div>
                    </div>

                    <div className="glass-card p-1 shadow-xl hover:shadow-farmx-green/10 transition-all duration-500 group">
                        <div className="bg-white/40 p-8 rounded-[1.5rem] border border-white/50 h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="text-xs font-black text-gray-400 bg-gray-100/50 px-3 py-1 rounded-full uppercase tracking-widest">Orders</div>
                            </div>
                            <p className="text-5xl font-black text-farmx-dark mb-1 tracking-tighter">{analytics?.totalOrders || 0}</p>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">Total Sales</p>
                        </div>
                    </div>

                    <div className="glass-card p-1 shadow-xl hover:shadow-farmx-green/10 transition-all duration-500 group">
                        <div className="bg-white/40 p-8 rounded-[1.5rem] border border-white/50 h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-amber-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div className="text-xs font-black text-gray-400 bg-gray-100/50 px-3 py-1 rounded-full uppercase tracking-widest">Average</div>
                            </div>
                            <p className="text-5xl font-black text-farmx-dark mb-1 tracking-tighter">
                                ₹{analytics?.totalOrders > 0 ? Math.round(analytics.totalIncome / analytics.totalOrders) : 0}
                            </p>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">Per Order</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sales by Crop Bar Chart */}
                    <div className="glass-card bg-white/40 border border-white/60 p-8 rounded-[2.5rem] shadow-xl">
                        <h2 className="text-2xl font-black text-farmx-dark mb-8">Sales by Crop Type</h2>
                        {salesByCropData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={salesByCropData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                                    <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                    <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400 font-bold">
                                No sales data available
                            </div>
                        )}
                    </div>

                    {/* Sales Distribution Pie Chart */}
                    <div className="glass-card bg-white/40 border border-white/60 p-8 rounded-[2.5rem] shadow-xl">
                        <h2 className="text-2xl font-black text-farmx-dark mb-8">Sales Distribution</h2>
                        {salesByCropData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={salesByCropData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="sales"
                                    >
                                        {salesByCropData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400 font-bold">
                                No sales data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={fetchAnalytics}
                        className="bg-farmx-green hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl hover:shadow-2xl active:scale-95"
                    >
                        🔄 Refresh Analytics
                    </button>
                </div>
            </div>
        </div>
    );
}
