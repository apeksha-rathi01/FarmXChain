import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import QRCode from 'qrcode';
import meshBg from '../assets/dashboard-mesh.png';

export default function ProductJourney() {
    const { id } = useParams();
    const [journey, setJourney] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        fetchJourney();
    }, [id]);

    const fetchJourney = async () => {
        try {
            const response = await api.get(`/public/trace/${id}`);
            setJourney(response.data);

            // Generate QR code
            const url = `${window.location.origin}/trace/${id}`;
            const qrUrl = await QRCode.toDataURL(url, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#1e293b',
                    light: '#ffffff'
                }
            });
            setQrCodeUrl(qrUrl);
        } catch (err) {
            setError('Could not verify product journey. Invalid Batch ID.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-gray-400">VERIFYING BLOCKCHAIN RECORDS...</div>;

    if (error) return (
        <div className="min-h-screen flex items-center justify-center flex-col">
            <h1 className="text-4xl">❌</h1>
            <p className="mt-4 font-black text-red-500">{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen relative font-sans text-farmx-dark">
            <div
                className="fixed inset-0 z-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: `url(${meshBg})`, backgroundSize: 'cover' }}
            ></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-full mb-4">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-black uppercase tracking-widest text-xs">Blockchain Verified</span>
                    </div>
                    <h1 className="text-6xl font-black mt-6 mb-2">{journey.crop.cropName}</h1>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs border border-gray-100 px-4 py-2 rounded-xl">Batch #{journey.crop.id}</span>
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs border border-gray-100 px-4 py-2 rounded-xl">Node: {journey.crop.location}</span>
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs border border-gray-100 px-4 py-2 rounded-xl">Substrate: Natural</span>
                    </div>

                    {/* QR Code Display */}
                    {qrCodeUrl && (
                        <div className="mt-8 inline-block">
                            <div className="bg-white p-4 rounded-2xl shadow-xl border-2 border-gray-100">
                                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                                <p className="text-xs font-bold text-gray-500 mt-2">Scan to verify</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="glass-card bg-white/60 p-10 rounded-[3rem] shadow-xl border border-white mb-12">
                    <h2 className="text-2xl font-black mb-8">Supply Chain Journey</h2>

                    <div className="relative pl-8 border-l-2 border-farmx-green/20 space-y-12">
                        {/* Origin */}
                        <div className="relative">
                            <div className="absolute -left-[41px] bg-farmx-green w-6 h-6 rounded-full border-4 border-white shadow"></div>
                            <h3 className="text-xl font-black">Harvested</h3>
                            <p className="text-sm font-bold text-gray-500">{new Date(journey.crop.harvestDate).toLocaleDateString()}</p>
                            <p className="mt-2 text-sm">Producer: <span className="font-bold">{journey.crop.farmerName || 'Original Node'}</span></p>
                            <div className="mt-2 bg-gray-100 inline-block px-3 py-2 rounded-lg">
                                <p className="text-xs font-mono text-gray-400">
                                    Origin Hash: {journey.crop.blockchainHash?.substring(0, 10)}...
                                </p>
                            </div>
                        </div>

                        {/* History */}
                        {journey.history.map((order, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[41px] bg-blue-500 w-6 h-6 rounded-full border-4 border-white shadow"></div>
                                <h3 className="text-xl font-black">Transferred Ownership</h3>
                                <p className="text-sm font-bold text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                                <div className="mt-2 text-sm bg-white/50 p-4 rounded-xl inline-block">
                                    <p>From: <span className="font-bold">{order.seller.name || `Seller #${order.seller.id}`}</span></p>
                                    <p>To: <span className="font-bold">{order.buyer.name || `Buyer #${order.buyer.id}`}</span></p>
                                    <p>Price: ₹{order.totalPrice}</p>
                                    <p className="text-xs text-gray-500 mt-1">Status: {order.status}</p>
                                </div>
                                <div className="block mt-2">
                                    <p className="text-xs font-mono bg-gray-100 inline-block px-2 py-1 rounded text-gray-400">
                                        TX: {order.transactionHash ? order.transactionHash.substring(0, 15) : `0x${order.id}abcdef...`}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Current Status */}
                        <div className="relative">
                            <div className="absolute -left-[41px] bg-farmx-dark w-6 h-6 rounded-full border-4 border-white shadow"></div>
                            <h3 className="text-xl font-black">{journey.crop.availableForSale ? 'In Storage' : 'With Consumer'}</h3>
                            <p className="text-sm font-bold text-gray-500">Current Status</p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Powered by Blockchain Technology</p>
                </div>
            </div>
        </div>
    );
}
