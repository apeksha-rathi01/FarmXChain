import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cropService } from '../../api/cropService';
import { blockchainService } from '../../api/blockchainService';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import meshBg from '../../assets/dashboard-mesh.png';

export default function ConsumerTraceability() {
    const { cropId: paramCropId } = useParams();
    const navigate = useNavigate();
    const [searchId, setSearchId] = useState(paramCropId || '');
    const [crop, setCrop] = useState(null);
    const [traceability, setTraceability] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchId) return;

        try {
            setLoading(true);
            setError('');
            const cropResponse = await cropService.getCropById(searchId);
            setCrop(cropResponse.data);

            const traceabilityResponse = await blockchainService.getTraceability(searchId);
            setTraceability(traceabilityResponse.data || []);
        } catch (err) {
            setError('Crop ID not found or network error');
            setCrop(null);
            setTraceability([]);
        } finally {
            setLoading(false);
        }
    };

    // Auto search if cropId is in URL
    React.useEffect(() => {
        if (paramCropId) {
            handleSearch();
        }
    }, [paramCropId]);

    return (
        <div className="min-h-screen relative overflow-hidden font-sans pb-12">
            <div
                className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: `url(${meshBg})`, backgroundSize: 'cover' }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-4 mb-3">
                        <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
                        <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Farm-to-Fork Transparency</span>
                        <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
                    </div>
                    <h1 className="text-6xl font-black text-farmx-dark tracking-tighter">
                        Trace Your <span className="text-farmx-green">Food</span>.
                    </h1>
                    <p className="text-gray-500 font-bold text-lg mt-4 max-w-2xl mx-auto">
                        Enter a Crop ID/Batch Number to see the complete journey verified by blockchain technology.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-16">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Enter Crop ID (e.g. 1)"
                            className="flex-1 px-8 py-5 rounded-[2rem] border-2 border-white/60 bg-white/40 backdrop-blur-md focus:border-farmx-green outline-none font-black text-lg shadow-xl shadow-gray-100/50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-farmx-green text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-farmx-green/20 hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Scanning...' : 'Trace'}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="max-w-2xl mx-auto glass-card bg-red-50/50 border border-red-200 p-8 rounded-[2.5rem] text-center mb-12 animate-slide-up">
                        <span className="text-4xl mb-4 block">🔍</span>
                        <h3 className="text-xl font-black text-red-700 uppercase tracking-widest mb-2">Registry Mismatch</h3>
                        <p className="text-red-500 font-bold">{error}</p>
                    </div>
                )}

                {crop && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in">
                        {/* Crop Summary */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="glass-card bg-white/40 border border-white/60 p-10 rounded-[3rem] shadow-2xl">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-3xl font-black text-farmx-dark tracking-tight">{crop.cropName}</h3>
                                    <div className="flex items-center gap-2 bg-farmx-green/10 text-farmx-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-farmx-green/20">
                                        <span className="text-xs">✓</span> Verified
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-farmx-green/10 rounded-2xl flex items-center justify-center text-xl">🌾</div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</p>
                                            <p className="font-black text-farmx-dark">{crop.cropType}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-farmx-green/10 rounded-2xl flex items-center justify-center text-xl">📅</div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Harvested</p>
                                            <p className="font-black text-farmx-dark">{formatDate(crop.harvestDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-farmx-green/10 rounded-2xl flex items-center justify-center text-xl">📍</div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Provenance</p>
                                            <p className="font-black text-farmx-dark">{crop.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-10 border-t border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Initial Producer</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-farmx-green rounded-xl flex items-center justify-center text-white font-black">
                                            {crop.farmerName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-farmx-dark leading-none">{crop.farmerName}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{crop.farmName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Traceability Timeline */}
                        <div className="lg:col-span-2">
                            <div className="glass-card bg-white/40 border border-white/60 p-12 rounded-[3.5rem] shadow-2xl">
                                <h3 className="text-2xl font-black text-farmx-dark mb-12 flex items-center gap-4">
                                    <span className="w-10 h-10 bg-farmx-green rounded-2xl flex items-center justify-center text-white text-sm shadow-lg">⛓️</span>
                                    Lifecycle Matrix
                                </h3>

                                <div className="relative pl-12 space-y-12">
                                    <div className="absolute left-5 top-2 bottom-2 w-1 bg-gradient-to-b from-farmx-green via-emerald-400 to-transparent rounded-full opacity-30"></div>

                                    {traceability.map((record, index) => (
                                        <div key={record.id} className="relative">
                                            <div className="absolute -left-[3.4rem] top-1 w-12 h-12 bg-white border-4 border-farmx-green rounded-2xl flex items-center justify-center shadow-xl z-10">
                                                <div className="w-2 h-2 bg-farmx-green rounded-full"></div>
                                            </div>
                                            <div className="p-8 bg-white/80 border border-white rounded-[2.5rem] shadow-lg transition-transform hover:-translate-y-1">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="text-xl font-black text-farmx-dark tracking-tight uppercase tracking-tighter">{record.stage}</h4>
                                                    <span className="text-[9px] font-black text-farmx-green uppercase tracking-widest bg-farmx-green/5 px-3 py-1 rounded-lg">
                                                        {record.timestamp.includes('T') ? getRelativeTime(record.timestamp) : record.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-bold text-gray-500 mb-4 flex items-center gap-2">
                                                    <span className="opacity-50">LOCATION:</span> {record.location}
                                                </p>
                                                <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 font-bold text-[11px] text-gray-400 italic">
                                                    "{record.notes}"
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-8 bg-farmx-dark text-white rounded-[2rem] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-farmx-green/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Blockchain Integrity Note</p>
                                    <p className="text-sm font-bold text-gray-300 leading-relaxed">
                                        Every stage above has been cryptographically signed and anchored to a decentralized ledger.
                                        This timeline is immutable and represents the absolute truth of this crop's origin and handling.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
