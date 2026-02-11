import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import meshBg from '../../assets/dashboard-mesh.png';

export default function ConsumerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Public Ledger...</p>
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
                <div className="mb-12 animate-fade-in">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em]">Food Transparency Network</span>
                    </div>
                    <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
                        Hello, <span className="text-emerald-500">{user?.name?.split(' ')[0] || 'Friend'}</span>.
                    </h1>
                    <p className="text-gray-500 font-bold text-lg mt-2">Know your food. Trace its journey. Trust the source.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="glass-card p-1 shadow-xl group cursor-pointer" onClick={() => navigate('/dashboard/crops')}>
                        <div className="bg-white/40 p-10 rounded-[2rem] border border-white/50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Market Discovery</p>
                                <h2 className="text-3xl font-black text-farmx-dark leading-tight">Explore Local <br />Verified Crops</h2>
                            </div>
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-[2rem] flex items-center justify-center text-4xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                                🥗
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-1 shadow-xl group cursor-pointer" onClick={() => navigate('/dashboard/traceability')}>
                        <div className="bg-white/40 p-10 rounded-[2rem] border border-white/50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Chain Authentication</p>
                                <h2 className="text-3xl font-black text-farmx-dark leading-tight">Verify Produce <br />Traceability</h2>
                            </div>
                            <div className="w-20 h-20 bg-blue-500/10 text-blue-600 rounded-[2rem] flex items-center justify-center text-4xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                                ⛓️
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md border border-white/60 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-black text-farmx-dark mb-6">Why Trust FarmXChain?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-black text-emerald-600 uppercase text-xs tracking-widest mb-2">Immutable Origins</h4>
                                <p className="text-gray-500 text-sm font-bold leading-relaxed">
                                    Every crop is registered by the farmer and verified by independent nodes. The data cannot be altered.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-black text-blue-600 uppercase text-xs tracking-widest mb-2">Real-time Quality</h4>
                                <p className="text-gray-500 text-sm font-bold leading-relaxed">
                                    Track the storage and transport conditions that ensure your food stays fresh and safe.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent flex items-center justify-center hidden lg:flex">
                        <div className="w-48 h-48 rounded-full border-8 border-white/50 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
