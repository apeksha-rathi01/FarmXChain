import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import heroRegister from '../assets/hero-register.png';
import bgPremium from '../assets/bg-premium.png';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden font-sans">
            {/* Background Decor */}
            <div className="absolute top-0 inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-farmx-green/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-700/10 rounded-full blur-[150px]"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="bg-farmx-green text-white p-2.5 rounded-2xl shadow-lg">
                        <Logo className="h-6 w-6 text-white" size="small" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter">
                        Farm<span className="text-farmx-green">X</span>Chain
                    </span>
                </div>
                <div className="flex items-center gap-8">
                    <Link to="/login" className="font-black text-sm uppercase tracking-widest hover:text-farmx-green transition-colors">Sign In</Link>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-farmx-green px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-farmx-green/20 hover:scale-105 transition-transform active:scale-95"
                    >
                        Join Network
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-40 px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                <div className="animate-slide-up">
                    <div className="inline-block px-4 py-2 bg-farmx-green/10 border border-farmx-green/20 rounded-full mb-6">
                        <span className="text-xs font-black text-farmx-green uppercase tracking-[0.2em]">Next Generation Agriculture</span>
                    </div>
                    <h1 className="text-7xl font-black leading-[1.05] tracking-tighter mb-10">
                        The Trust Layer <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-farmx-green to-emerald-400">
                            For Global Food.
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 font-medium leading-relaxed mb-12 max-w-xl">
                        A blockchain-powered ecosystem connecting Farmers, Distributors, Retailers, and Consumers in a transparent, resilient supply chain.
                    </p>
                    <div className="flex flex-wrap gap-6">
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-slate-950 px-10 py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-farmx-green hover:text-white transition-all shadow-2xl"
                        >
                            Start Onboarding
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-slate-900 text-white border border-slate-800 px-10 py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:border-farmx-green transition-all"
                        >
                            Enterprise Login
                        </button>
                    </div>
                </div>

                <div className="relative animate-float">
                    <div className="absolute inset-0 bg-farmx-green/20 blur-[100px] rounded-full"></div>
                    <div className="relative glass-card border-white/10 p-4 rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
                        <img src={heroRegister} alt="Agriculture Tech" className="rounded-[2.5rem] w-full aspect-[4/5] object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
                        <div className="absolute bottom-8 left-8 right-8 bg-black/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10">
                            <p className="text-xs font-black text-farmx-green uppercase tracking-widest mb-1">Live Protocol Status</p>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 bg-farmx-green rounded-full animate-pulse"></div>
                                <p className="font-bold">Network Height: 4,821,092</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Role Section */}
            <section className="bg-slate-900/50 py-32 border-y border-slate-800/50">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black tracking-tight mb-4">One Platform. Five Unified Nodes.</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Architected for the whole ecosystem</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { role: 'Farmers', desc: 'Secure blockchain identity, crop registration, and direct market access.', icon: '👨‍🌾' },
                            { role: 'Distributors', desc: 'Real-time logistics tracking and smart contract automation.', icon: '🚚' },
                            { role: 'Retailers', desc: 'Verified sourcing and quality assurance for discerning customers.', icon: '🏪' },
                            { role: 'Consumers', desc: 'Unprecedented transparency from soil to shelf.', icon: '🥗' },
                            { role: 'Admins', desc: 'Network governance and decentralized user verification.', icon: '🛡️' },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-950/50 border border-slate-800 p-10 rounded-[2.5rem] hover:border-farmx-green transition-all group">
                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h3 className="text-2xl font-black mb-4">{item.role}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <footer className="py-20 px-8 text-center relative z-10">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-5xl font-black tracking-tight mb-10">Ready to secure your place in the future of food?</h2>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-farmx-green text-white px-12 py-6 rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl shadow-farmx-green/30 hover:scale-105 transition-all"
                    >
                        Join the Consensus
                    </button>
                    <p className="mt-12 text-gray-600 font-bold text-sm uppercase tracking-[0.3em]">
                        © 2026 FarmXChain Protocol. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
