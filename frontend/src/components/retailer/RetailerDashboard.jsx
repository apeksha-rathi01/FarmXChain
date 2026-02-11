import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import meshBg from '../../assets/dashboard-mesh.png';

export default function RetailerDashboard() {
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
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Syncing Quality Protocol...</p>
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
                        <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
                        <span className="text-xs font-black text-orange-500 uppercase tracking-[0.3em]">Quality Assurance Hub</span>
                    </div>
                    <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
                        Retailer Portal: <span className="text-orange-500">{user?.name?.split(' ')[0]}</span>.
                    </h1>
                    <p className="text-gray-500 font-bold text-lg mt-2">Connecting blockchain trust to consumer plates.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="glass-card p-1 shadow-xl group">
                        <div className="bg-white/40 p-8 rounded-[1.5rem] border border-white/50">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    🏬
                                </div>
                                <div className="text-xs font-black text-gray-400 bg-gray-100/50 px-3 py-1 rounded-full uppercase">Stock Level</div>
                            </div>
                            <p className="text-5xl font-black text-farmx-dark mb-1 tracking-tighter">842</p>
                            <p className="text-sm font-bold text-gray-400 text-xs tracking-widest uppercase mt-2">Verified Units</p>
                        </div>
                    </div>

                    <div className="glass-card p-1 shadow-xl group">
                        <div className="bg-white/40 p-8 rounded-[1.5rem] border border-white/50">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all">
                                    🍎
                                </div>
                                <div className="text-xs font-black text-rose-400 bg-rose-50 px-3 py-1 rounded-full uppercase">Freshness</div>
                            </div>
                            <p className="text-5xl font-black text-farmx-dark mb-1 tracking-tighter">96%</p>
                            <p className="text-sm font-bold text-gray-400 text-xs tracking-widest uppercase mt-2">Optimal Shelf Life</p>
                        </div>
                    </div>

                    <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl shadow-orange-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-rose-600"></div>
                        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                            <div>
                                <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-2">Consumer Trust</p>
                                <h3 className="text-2xl font-black text-white leading-tight">Blockchain certificates <br /><span className="underline decoration-orange-300 decoration-4 text-white">active in store</span>.</h3>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard/crops')}
                                className="w-full bg-white text-orange-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-50 transition-colors shadow-xl"
                            >
                                Stock Inventory
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-card p-8 bg-white/40 border border-white/60 shadow-xl rounded-[2.5rem]">
                        <h2 className="text-2xl font-black text-farmx-dark mb-8">Retailer Protocol</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'Sourcing Explorer', icon: '🌍', path: '/dashboard/crops', color: 'from-orange-400 to-rose-500' },
                                { label: 'My Inventory', icon: '📦', path: '/dashboard/inventory', color: 'from-amber-400 to-orange-600' },
                                { label: 'Source Verification', icon: '📜', path: '/dashboard/trace', color: 'from-pink-500 to-rose-700' },
                                { label: 'Store Analytics', icon: '📊', path: '/dashboard/profile', color: 'from-slate-700 to-slate-900' }
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
                                        <p className="font-black text-gray-900 group-hover:text-orange-600 transition-colors">{action.label}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Execute Protocol</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-rose-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-700"></div>
                        <h3 className="text-xl font-black mb-4">Retail Insight</h3>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">
                            Verified crops can be sold at a 15% premium to consumers who value transparency and ethical sourcing.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-orange-400 uppercase tracking-widest cursor-pointer hover:translate-x-1 transition-transform">
                            Sourcing Insights <span>→</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
