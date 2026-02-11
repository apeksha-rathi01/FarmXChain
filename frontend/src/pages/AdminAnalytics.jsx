import React, { useState, useEffect } from 'react';
import AnalyticsService from '../services/AnalyticsService';
import ReportService from '../services/ReportService';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import meshBg from '../assets/dashboard-mesh.png';

export default function AdminAnalytics() {
    const [systemStats, setSystemStats] = useState(null);
    const [demandTrends, setDemandTrends] = useState(null);
    const [pricingTrends, setPricingTrends] = useState(null);
    const [supplyChain, setSupplyChain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAllAnalytics();
    }, []);

    const fetchAllAnalytics = async () => {
        try {
            setLoading(true);
            const [system, demand, pricing, supply] = await Promise.all([
                AnalyticsService.getSystemAnalytics(),
                AnalyticsService.getDemandTrends(),
                AnalyticsService.getPricingTrends(),
                AnalyticsService.getSupplyChainMetrics()
            ]);

            setSystemStats(system.data);
            setDemandTrends(demand.data);
            setPricingTrends(pricing.data);
            setSupplyChain(supply.data);
        } catch (err) {
            setError('Failed to load analytics');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async (type) => {
        try {
            setGenerating(true);
            setSuccessMsg('');
            let response;
            switch (type) {
                case 'SYSTEM': response = await ReportService.generateSystemReport(); break;
                case 'TRANSACTION': response = await ReportService.generateTransactionReport(); break;
                case 'SUPPLY_CHAIN': response = await ReportService.generateSupplyChainReport(); break;
                default: response = await ReportService.generateSystemReport();
            }
            setSuccessMsg(`${type} Report generated successfully! ID: #${response.data.id}`);
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (err) {
            setError('Failed to generate report');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-farmx-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Platform Analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 font-bold text-xl">{error}</p>
            </div>
        );
    }

    // Prepare chart data
    const demandData = Object.entries(demandTrends?.demandByCrop || {}).map(([name, value]) => ({
        name,
        orders: value
    }));

    const pricingData = Object.entries(pricingTrends?.averagePricePerCrop || {}).map(([name, value]) => ({
        name,
        avgPrice: parseFloat(value.toFixed(2))
    }));

    return (
        <div className="min-h-screen relative overflow-hidden font-sans pb-12">
            <div
                className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: `url(${meshBg})`, backgroundSize: 'cover' }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
                            <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Platform Intelligence</span>
                        </div>
                        <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
                            Admin <span className="text-farmx-green">Analytics</span>.
                        </h1>
                        <p className="text-gray-500 font-bold text-lg mt-2">Comprehensive platform insights</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={fetchAllAnalytics}
                            title="Refresh Data"
                            className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xl hover:bg-gray-50 transition-all active:scale-95"
                        >
                            <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                {successMsg && (
                    <div className="glass-card bg-green-50/80 border border-green-200 p-6 rounded-3xl mb-8 flex justify-between items-center text-green-700">
                        <span className="font-black text-sm uppercase tracking-widest">✅ {successMsg}</span>
                        <button onClick={() => setSuccessMsg('')} className="font-black">×</button>
                    </div>
                )}

                {/* Report Generation Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'System Health', type: 'SYSTEM', icon: '🛡️' },
                        { label: 'Transactions', type: 'TRANSACTION', icon: '💰' },
                        { label: 'Supply Chain', type: 'SUPPLY_CHAIN', icon: '🚛' }
                    ].map((report, idx) => (
                        <button
                            key={idx}
                            disabled={generating}
                            onClick={() => handleGenerateReport(report.type)}
                            className="glass-card bg-white/60 border border-white/80 p-6 rounded-2xl shadow-lg hover:shadow-farmx-green/5 transition-all text-left group disabled:opacity-50"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{report.icon}</span>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Generate</p>
                                    <p className="text-sm font-black text-farmx-dark group-hover:text-farmx-green transition-colors">{report.label} Report</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* System Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {[
                        { label: 'Total Users', value: systemStats?.totalUsers || 0, icon: '👥', color: 'bg-blue-600' },
                        { label: 'Total Farmers', value: systemStats?.totalFarmers || 0, icon: '🌾', color: 'bg-green-600' },
                        { label: 'Total Orders', value: systemStats?.totalOrders || 0, icon: '📦', color: 'bg-amber-600' },
                        { label: 'Total Crops', value: systemStats?.totalCrops || 0, icon: '🌱', color: 'bg-emerald-600' }
                    ].map((stat, idx) => (
                        <div key={idx} className="glass-card p-1 shadow-xl hover:shadow-farmx-green/10 transition-all duration-500 group">
                            <div className="bg-white/40 p-6 rounded-[1.5rem] border border-white/50 h-full">
                                <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform w-fit mb-4`}>
                                    <span className="text-2xl">{stat.icon}</span>
                                </div>
                                <p className="text-4xl font-black text-farmx-dark mb-1">{stat.value}</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Supply Chain Metrics */}
                <div className="glass-card bg-white/40 border border-white/60 p-8 rounded-[2.5rem] shadow-xl mb-8">
                    <h2 className="text-2xl font-black text-farmx-dark mb-6">Supply Chain Performance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                            <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Fulfillment Rate</p>
                            <p className="text-4xl font-black text-green-700">{supplyChain?.fulfillmentRate?.toFixed(1) || 0}%</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                            <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Transaction Volume</p>
                            <p className="text-4xl font-black text-blue-700">₹{supplyChain?.totalTransactionVolume || 0}</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                            <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-2">Total Orders</p>
                            <p className="text-4xl font-black text-purple-700">{supplyChain?.totalOrders || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Demand Trends */}
                    <div className="glass-card bg-white/40 border border-white/60 p-8 rounded-[2.5rem] shadow-xl">
                        <h2 className="text-2xl font-black text-farmx-dark mb-8">Crop Demand Trends</h2>
                        {demandData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={demandData}>
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
                                    <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400 font-bold">
                                No demand data available
                            </div>
                        )}
                    </div>

                    {/* Pricing Trends */}
                    <div className="glass-card bg-white/40 border border-white/60 p-8 rounded-[2.5rem] shadow-xl">
                        <h2 className="text-2xl font-black text-farmx-dark mb-8">Average Pricing by Crop</h2>
                        {pricingData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={pricingData}>
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
                                    <Bar dataKey="avgPrice" fill="#10b981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400 font-bold">
                                No pricing data available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
