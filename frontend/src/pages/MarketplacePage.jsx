import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cropService } from '../api/cropService';
import { orderService } from '../api/orderService';
import { useAuth } from '../context/AuthContext';
import meshBg from '../assets/dashboard-mesh.png';

export default function MarketplacePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [crops, setCrops] = useState([]);
    const [filteredCrops, setFilteredCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [orderQuantity, setOrderQuantity] = useState('');
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [ordering, setOrdering] = useState(false);

    useEffect(() => {
        fetchMarketplaceCrops();
    }, []);

    useEffect(() => {
        filterCrops();
    }, [searchTerm, filterType, crops]);

    const fetchMarketplaceCrops = async () => {
        try {
            setLoading(true);
            const response = await cropService.getMarketplaceCrops();
            // Server now filters for availableForSale: true
            const availableCrops = response.data;
            setCrops(availableCrops);
            setFilteredCrops(availableCrops);
        } catch (err) {
            setError('Failed to load marketplace crops');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterCrops = () => {
        let filtered = crops;

        if (searchTerm) {
            filtered = filtered.filter(crop =>
                crop.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                crop.location?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType) {
            filtered = filtered.filter(crop => crop.cropType === filterType);
        }

        setFilteredCrops(filtered);
    };

    const handlePlaceOrder = (crop) => {
        setSelectedCrop(crop);
        setOrderQuantity('');
        setShowOrderModal(true);
    };

    const submitOrder = async () => {
        if (!orderQuantity || parseFloat(orderQuantity) <= 0) {
            setError('Please enter a valid quantity');
            return;
        }

        if (parseFloat(orderQuantity) > selectedCrop.availableQuantity) {
            setError('Quantity exceeds available stock');
            return;
        }

        try {
            setOrdering(true);
            setError('');

            const orderData = {
                cropId: selectedCrop.id,
                sellerId: selectedCrop.currentOwnerId || selectedCrop.farmerId,
                quantity: parseFloat(orderQuantity),
                pricePerUnit: selectedCrop.pricePerUnit,
            };

            await orderService.createOrder(orderData);
            setSuccess('Order placed successfully!');
            setShowOrderModal(false);
            fetchMarketplaceCrops(); // Refresh to show updated quantities
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to place order');
        } finally {
            setOrdering(false);
        }
    };

    const cropTypes = [...new Set(crops.map(c => c.cropType))].filter(Boolean);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <div className="w-16 h-16 border-4 border-farmx-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Marketplace...</p>
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
                <div className="mb-12 animate-fade-in">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
                        <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Supply Chain Hub</span>
                    </div>
                    <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
                        Crop <span className="text-farmx-green">Marketplace</span>.
                    </h1>
                    <p className="text-gray-500 font-bold text-lg mt-2">Browse and purchase verified agricultural products</p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="glass-card bg-red-50/50 border border-red-200 p-6 rounded-[2rem] mb-8 flex justify-between items-center text-red-700">
                        <span className="font-black text-sm uppercase tracking-widest">⚠️ {error}</span>
                        <button onClick={() => setError('')} className="font-black hover:scale-110 transition-transform">×</button>
                    </div>
                )}

                {success && (
                    <div className="glass-card bg-green-50/50 border border-green-200 p-6 rounded-[2rem] mb-8 flex justify-between items-center text-green-700">
                        <span className="font-black text-sm uppercase tracking-widest">✅ {success}</span>
                        <button onClick={() => setSuccess('')} className="font-black hover:scale-110 transition-transform">×</button>
                    </div>
                )}

                {/* Filters */}
                <div className="glass-card bg-white/40 border border-white/60 p-6 rounded-[2rem] mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Search crops or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-farmx-green outline-none font-bold text-sm"
                        />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-farmx-green outline-none font-bold text-sm"
                        >
                            <option value="">All Crop Types</option>
                            {cropTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Crops Grid */}
                {filteredCrops.length === 0 ? (
                    <div className="glass-card bg-white/40 border border-white/60 p-20 text-center rounded-[3rem]">
                        <div className="text-8xl mb-8 opacity-20">🌾</div>
                        <h3 className="text-3xl font-black text-farmx-dark">No Crops Available</h3>
                        <p className="text-gray-400 font-bold mt-2 uppercase tracking-[0.2em] text-xs">Check back later for new listings</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCrops.map((crop, index) => (
                            <div
                                key={crop.id}
                                className="glass-card bg-white/40 border border-white/60 rounded-[2.5rem] shadow-2xl overflow-hidden group hover:shadow-farmx-green/10 transition-all duration-500"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-black text-farmx-dark tracking-tight">{crop.cropName}</h3>
                                            <p className="text-[10px] font-black text-farmx-green/60 uppercase tracking-widest mt-1">{crop.cropType}</p>
                                        </div>
                                        {crop.blockchainHash && (
                                            <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-[10px] font-black uppercase">
                                                Verified
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</span>
                                            <span className="text-lg font-black text-farmx-green">₹{crop.pricePerUnit}/{crop.unit}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available</span>
                                            <span className="text-sm font-black text-farmx-dark">{crop.availableQuantity} {crop.unit}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</span>
                                            <span className="text-sm font-black text-farmx-dark">{crop.location || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-100/50">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Owner</span>
                                            <span className="text-xs font-black text-blue-600">{crop.currentOwnerName || 'Processing...'}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handlePlaceOrder(crop)}
                                        className="w-full py-4 bg-farmx-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-farmx-green-dark transition-all shadow-lg shadow-farmx-green/10"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Modal */}
            {showOrderModal && selectedCrop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="glass-card bg-white/90 border border-white/60 rounded-[3rem] shadow-2xl max-w-lg mx-4 p-10">
                        <h2 className="text-3xl font-black text-farmx-dark mb-6">Place Order</h2>

                        <div className="space-y-4 mb-8">
                            <div>
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Crop</p>
                                <p className="text-xl font-black text-farmx-dark">{selectedCrop.cropName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Price per {selectedCrop.unit}</p>
                                <p className="text-xl font-black text-farmx-green">₹{selectedCrop.pricePerUnit}</p>
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Quantity ({selectedCrop.unit})</p>
                                <input
                                    type="number"
                                    value={orderQuantity}
                                    onChange={(e) => setOrderQuantity(e.target.value)}
                                    max={selectedCrop.availableQuantity}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-farmx-green outline-none font-bold text-lg"
                                    placeholder={`Max: ${selectedCrop.availableQuantity}`}
                                />
                            </div>
                            {orderQuantity && (
                                <div className="p-4 bg-farmx-green/10 rounded-xl">
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Total Price</p>
                                    <p className="text-2xl font-black text-farmx-green">
                                        ₹{(parseFloat(orderQuantity) * parseFloat(selectedCrop.pricePerUnit)).toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowOrderModal(false)}
                                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitOrder}
                                disabled={ordering}
                                className="flex-1 py-4 bg-farmx-green text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-farmx-green-dark transition-all shadow-lg shadow-farmx-green/20 disabled:opacity-50"
                            >
                                {ordering ? 'Placing...' : 'Confirm Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
