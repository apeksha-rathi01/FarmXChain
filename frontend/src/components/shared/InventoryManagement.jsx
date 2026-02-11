import React, { useState, useEffect } from 'react';
import { cropService } from '../../api/cropService';
import { formatDate } from '../../utils/helpers';
import meshBg from '../../assets/dashboard-mesh.png';

export default function InventoryManagement() {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showListModal, setShowListModal] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [price, setPrice] = useState('');
    const [listing, setListing] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await cropService.getMyInventory();
            setCrops(response.data);
        } catch (err) {
            setError('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleListForSale = (crop) => {
        setSelectedCrop(crop);
        setPrice(crop.pricePerUnit || '');
        setShowListModal(true);
    };

    const submitListing = async () => {
        if (!price || parseFloat(price) <= 0) {
            alert('Please enter a valid price');
            return;
        }

        try {
            setListing(true);
            await cropService.updateListing(selectedCrop.id, {
                available: true,
                price: parseFloat(price),
                quantity: selectedCrop.quantity // Default to full quantity
            });
            setShowListModal(false);
            fetchInventory();
            alert('Crop listed on marketplace!');
        } catch (err) {
            alert('Failed to list crop');
        } finally {
            setListing(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Inventory...</div>;

    const unlistedCrops = crops.filter(c => !c.availableForSale);
    const listedCrops = crops.filter(c => c.availableForSale);

    const handleEditListing = (crop) => {
        setSelectedCrop(crop);
        setPrice(crop.pricePerUnit || '');
        setShowListModal(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-black text-farmx-dark mb-8">My <span className="text-farmx-green">Inventory</span></h2>

            {/* Unlisted Inventory Section */}
            <div className="mb-12">
                <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">Unlisted Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {unlistedCrops.map((crop) => (
                        <div key={crop.id} className="glass-card bg-white/40 border border-white/60 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-6xl">📦</span>
                            </div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <h3 className="text-xl font-black text-farmx-dark">{crop.cropName}</h3>
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    {crop.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-8 relative z-10">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400">Stock</span>
                                    <span>{crop.quantity} {crop.unit}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400">Origin</span>
                                    <span>{crop.location}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleListForSale(crop)}
                                className="w-full py-4 bg-farmx-dark text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-farmx-green transition-all relative z-10 shadow-lg shadow-farmx-dark/20 hover:shadow-farmx-green/30"
                            >
                                List on Marketplace
                            </button>
                        </div>
                    ))}
                </div>
                {unlistedCrops.length === 0 && (
                    <div className="text-center py-10 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No unlisted inventory</p>
                    </div>
                )}
            </div>

            {/* Active Listings Section */}
            <div>
                <h3 className="text-xl font-black text-farmx-green uppercase tracking-widest mb-6 border-b border-farmx-green/20 pb-2">Active Listings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listedCrops.map((crop) => (
                        <div key={crop.id} className="glass-card bg-white border-2 border-farmx-green/10 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-farmx-green text-white px-4 py-2 rounded-bl-2xl font-black text-xs uppercase tracking-widest">
                                For Sale
                            </div>

                            <div className="flex justify-between items-start mb-6 mt-2">
                                <h3 className="text-xl font-black text-farmx-dark">{crop.cropName}</h3>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-farmx-green">₹{crop.pricePerUnit}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Per {crop.unit}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm font-bold border-b border-gray-100 pb-2">
                                    <span className="text-gray-400">Available Qty</span>
                                    <span>{crop.availableQuantity || crop.quantity} {crop.unit}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-400">Location</span>
                                    <span>{crop.location}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleEditListing(crop)}
                                className="w-full py-4 bg-white border-2 border-farmx-green text-farmx-green rounded-xl font-black text-xs uppercase tracking-widest hover:bg-farmx-green hover:text-white transition-all"
                            >
                                Update Price / Edit
                            </button>
                        </div>
                    ))}
                </div>
                {listedCrops.length === 0 && (
                    <div className="text-center py-10 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active listings</p>
                    </div>
                )}
            </div>

            {showListModal && selectedCrop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="glass-card bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full animate-fade-in-up">
                        <h3 className="text-2xl font-black text-farmx-dark mb-6">
                            {selectedCrop.availableForSale ? 'Update Listing' : 'List on Marketplace'}
                        </h3>
                        <p className="text-sm font-bold text-gray-500 mb-8">
                            Set your price for <span className="text-farmx-green">{selectedCrop.cropName}</span>.
                        </p>

                        <div className="mb-8">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price per {selectedCrop.unit} (₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">₹</span>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full pl-10 pr-6 py-4 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-farmx-green outline-none font-black text-lg transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowListModal(false)}
                                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitListing}
                                disabled={listing}
                                className="flex-1 py-4 bg-farmx-green text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-farmx-green/20 hover:shadow-xl hover:shadow-farmx-green/30 transition-all hover:-translate-y-1"
                            >
                                {listing ? 'Saving...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
