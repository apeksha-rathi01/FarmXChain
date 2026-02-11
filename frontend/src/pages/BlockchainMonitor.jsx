import React, { useState, useEffect } from 'react';
import meshBg from '../assets/dashboard-mesh.png';

export default function BlockchainMonitor() {
    const [stats, setStats] = useState({
        contractAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
        network: 'Ethereum Mainnet (FarmX-Bridge)',
        totalTransactions: 124,
        gasUsed: '8,452,109 Gwei',
        uptime: '99.99%',
        lastSync: new Date().toLocaleString()
    });

    const [events, setEvents] = useState([
        { id: 1, event: 'OwnershipTransferred', data: 'Crop #42 -> Buyer #11', hash: '0x9d2b...f3e1', time: '2 mins ago' },
        { id: 2, event: 'CropRegistered', data: 'Farmer #05: 500kg Wheat', hash: '0x7s1a...2d8c', time: '15 mins ago' },
        { id: 3, event: 'PaymentVerified', data: 'TXN: 0x88f2...9b0d', hash: '0x44v2...1p9z', time: '1 hour ago' },
        { id: 4, event: 'ShipmentLogged', data: 'Current: Mumbai, Temp: 22°C', hash: '0x1q7x...99aa', time: '3 hours ago' },
        { id: 5, event: 'ContractDeployed', data: 'v2.4 Migration Success', hash: '0x00ff...88bb', time: '1 day ago' }
    ]);

    return (
        <div className="min-h-screen relative overflow-hidden font-sans pb-12">
            <div
                className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: `url(${meshBg})`, backgroundSize: 'cover' }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-1 w-12 bg-slate-800 rounded-full"></div>
                        <span className="text-xs font-black text-slate-800 uppercase tracking-[0.3em]">Governance Ledger</span>
                    </div>
                    <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
                        Smart Contract <span className="text-slate-800">Monitor</span>.
                    </h1>
                    <p className="text-gray-500 font-bold text-lg mt-2">Real-time blockchain event auditing.</p>
                </div>

                {/* Contract Status cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="glass-card p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contract Address</p>
                            <p className="font-mono text-xs break-all mb-2">{stats.contractAddress}</p>
                            <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest">Active Node</span>
                        </div>
                    </div>

                    <div className="glass-card p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Network Integrity</p>
                        <div className="flex items-center gap-4">
                            <p className="text-4xl font-black text-farmx-dark">{stats.uptime}</p>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1.5 h-6 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>)}
                            </div>
                        </div>
                        <p className="text-xs font-bold text-gray-400 mt-2">Sync: {stats.lastSync}</p>
                    </div>

                    <div className="glass-card p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Ledger Activity</p>
                        <p className="text-4xl font-black text-farmx-dark">{stats.totalTransactions}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">{stats.gasUsed} Total Gas</p>
                    </div>
                </div>

                {/* Event Log */}
                <div className="glass-card bg-white border border-gray-100 rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-2xl font-black text-farmx-dark">Immutable Event Logs</h2>
                        <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">Export Ledger</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Type</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Interaction Data</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tx Hash</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 font-bold text-sm">
                                {events.map((ev) => (
                                    <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px]">
                                                {ev.event}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-gray-600">{ev.data}</td>
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-slate-300 group-hover:text-slate-500 transition-colors text-xs">{ev.hash}</span>
                                        </td>
                                        <td className="px-8 py-6 text-gray-400 text-xs">{ev.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-8 bg-gray-50/30 text-center">
                        <p className="text-xs font-bold text-gray-400">Showing last 50 blockchain interactions. Contract: FarmXCore_v2.4</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
