import React, { useState, useEffect } from 'react';
import DisputeService from '../services/DisputeService';
import meshBg from '../assets/dashboard-mesh.png';

export default function DisputeManagement() {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [resolution, setResolution] = useState('');
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchDisputes();
    }, [filter]);

    const fetchDisputes = async () => {
        try {
            setLoading(true);
            let response;
            if (filter === 'ALL') {
                response = await DisputeService.getAllDisputes();
            } else {
                response = await DisputeService.getDisputesByStatus(filter);
            }
            setDisputes(response.data);
        } catch (err) {
            setError('Failed to load disputes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        if (!resolution.trim()) {
            alert('Please enter a resolution');
            return;
        }

        try {
            await DisputeService.resolveDispute(id, resolution);
            setResolution('');
            setSelectedDispute(null);
            fetchDisputes();
            alert('Dispute resolved successfully');
        } catch (err) {
            alert('Failed to resolve dispute');
            console.error(err);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            'OPEN': 'bg-red-100 text-red-700',
            'UNDER_REVIEW': 'bg-yellow-100 text-yellow-700',
            'RESOLVED': 'bg-green-100 text-green-700',
            'CLOSED': 'bg-gray-100 text-gray-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-farmx-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Disputes...</p>
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
                {/* Header */}
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
                            <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Governance</span>
                        </div>
                        <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
                            Dispute <span className="text-farmx-green">Management</span>.
                        </h1>
                        <p className="text-gray-500 font-bold text-lg mt-2">Resolve conflicts and maintain platform integrity</p>
                    </div>
                    <button
                        onClick={fetchDisputes}
                        className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xl hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {/* Filters */}
                <div className="mb-8 flex gap-4">
                    {['ALL', 'OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${filter === status
                                    ? 'bg-farmx-green text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 font-bold">
                        {error}
                    </div>
                )}

                {/* Disputes List */}
                <div className="glass-card bg-white/40 border border-white/60 p-8 rounded-[2.5rem] shadow-xl">
                    {disputes.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 font-bold text-lg">No disputes found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {disputes.map((dispute) => (
                                <div
                                    key={dispute.id}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-black text-farmx-dark">Dispute #{dispute.id}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-black ${getStatusBadge(dispute.status)}`}>
                                                    {dispute.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 font-bold">Order ID: {dispute.orderId}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 font-bold">
                                            {new Date(dispute.createdDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold mb-1">Reported By</p>
                                            <p className="font-bold">{dispute.reportedByName}</p>
                                            <p className="text-xs text-gray-500">{dispute.reportedByEmail}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold mb-1">Reported Against</p>
                                            <p className="font-bold">{dispute.reportedAgainstName}</p>
                                            <p className="text-xs text-gray-500">{dispute.reportedAgainstEmail}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 font-bold mb-1">Reason</p>
                                        <p className="font-bold text-farmx-dark">{dispute.reason}</p>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 font-bold mb-1">Description</p>
                                        <p className="text-sm text-gray-700">{dispute.description}</p>
                                    </div>

                                    {dispute.resolution && (
                                        <div className="bg-green-50 p-4 rounded-xl mb-4">
                                            <p className="text-xs text-green-700 font-bold mb-1">Resolution</p>
                                            <p className="text-sm text-green-900">{dispute.resolution}</p>
                                            {dispute.resolvedByName && (
                                                <p className="text-xs text-green-600 mt-2">Resolved by: {dispute.resolvedByName}</p>
                                            )}
                                        </div>
                                    )}

                                    {dispute.status !== 'RESOLVED' && dispute.status !== 'CLOSED' && (
                                        <div>
                                            {selectedDispute === dispute.id ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        value={resolution}
                                                        onChange={(e) => setResolution(e.target.value)}
                                                        placeholder="Enter resolution details..."
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-farmx-green"
                                                        rows="3"
                                                    />
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleResolve(dispute.id)}
                                                            className="bg-farmx-green text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-all"
                                                        >
                                                            Submit Resolution
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedDispute(null);
                                                                setResolution('');
                                                            }}
                                                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedDispute(dispute.id)}
                                                    className="bg-farmx-green text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-all"
                                                >
                                                    Resolve Dispute
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
