import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cropService } from '../../api/cropService';
import meshBg from '../../assets/dashboard-mesh.png';

export default function CropExplorer() {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const response = await cropService.getMarketplaceCrops();
                setCrops(response.data);
            } catch (error) {
                console.error('Error fetching crops:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCrops();
    }, []);

    const filteredCrops = crops.filter(crop =>
        crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-farmx-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-farmx-dark tracking-tight mb-4">
                        Ecosystem <span className="text-farmx-green">Explorer</span>
                    </h1>
                    <p className="text-gray-500 font-bold max-w-2xl">
                        Browse verified, blockchain-backed agricultural inventory from across the network.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-12 max-w-xl">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search by crop name or origin..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/50 backdrop-blur-md border border-gray-100 p-6 rounded-3xl outline-none focus:ring-4 focus:ring-farmx-green/10 transition-all font-bold text-gray-700 shadow-xl"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCrops.map((crop) => (
                        <div
                            key={crop.id}
                            className="glass-card bg-white/40 border border-white/60 p-8 rounded-[2.5rem] shadow-2xl hover:shadow-farmx-green/20 transition-all duration-500 group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-farmx-green to-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-farmx-green/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                    🍃
                                </div>
                                {crop.blockchainHash && (
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-100 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                                        Verified
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-black text-farmx-dark mb-2 tracking-tight group-hover:text-farmx-green transition-colors">
                                {crop.cropName}
                            </h3>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-500 font-bold">
                                    <span className="w-5 text-farmx-green">📍</span>
                                    {crop.location}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500 font-bold">
                                    <span className="w-5 text-farmx-green">⚖️</span>
                                    {crop.quantity} {crop.unit}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500 font-bold">
                                    <span className="w-5 text-farmx-green">📅</span>
                                    Harvested on {new Date(crop.harvestDate).toLocaleDateString()}
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/dashboard/traceability/${crop.id}`)}
                                className="w-full bg-farmx-dark text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-farmx-green transition-all shadow-xl active:scale-95"
                            >
                                Trace Flow
                            </button>
                        </div>
                    ))}

                    {filteredCrops.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="text-6xl mb-4 opacity-20">🔍</div>
                            <h3 className="text-2xl font-black text-gray-400">No assets found matching your criteria.</h3>
                            <p className="text-gray-400 font-bold mt-2 text-sm uppercase tracking-widest">Widen your search radius protocol.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
