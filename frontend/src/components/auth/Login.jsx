import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../api/authService';
import { validateEmail } from '../../utils/validation';
import Logo from '../Logo';
import '../auth/Auth.css';
import bgPremium from '../../assets/bg-premium.png';
import heroLogin from '../../assets/hero-login.png';

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(credentials.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(credentials.email, credentials.password);
      if (response.success) {
        const { token, userId, name, email, role } = response;
        const user = { id: userId, name, email, role };
        login(user, token);
        window.location.href = '/dashboard';
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] scale-110 animate-pulse-slow"
        style={{ backgroundImage: `url(${bgPremium})`, filter: 'brightness(0.4)' }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in mx-4">
        {/* Left Side: Hero Image (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 relative">
          <img
            src={heroLogin}
            alt="FarmX Success"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-farmx-dark/80 via-transparent to-transparent flex flex-col justify-end p-12">
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
              Digitizing the future of <span className="text-farmx-green">Agriculture.</span>
            </h1>
            <p className="text-gray-200 font-medium text-lg leading-relaxed">
              Join thousands of farmers tracking their produce with 100% transparency on the blockchain.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-10 lg:p-16 glass-card">
          <div className="mb-10 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-farmx-green text-white p-2.5 rounded-2xl shadow-lg shadow-farmx-green/30">
                <Logo className="h-6 w-6 text-white" size="small" />
              </div>
              <span className="text-2xl font-black text-farmx-dark tracking-tighter">
                Farm<span className="text-farmx-green">X</span>Chain
              </span>
            </div>

            <h2 className="text-4xl font-black text-farmx-dark mb-3 tracking-tight">
              Welcome Back.
            </h2>
            <p className="text-gray-500 font-semibold text-lg">
              Unlock your agricultural ecosystem.
            </p>
          </div>

          <form className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }} onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/50 backdrop-blur-sm border border-red-200 text-red-700 px-6 py-4 rounded-[1.25rem] flex justify-between items-center text-sm">
                <span className="font-bold flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </span>
                <button type="button" onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label htmlFor="email" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 px-1">
                  Email Intelligence
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-6 py-5 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-farmx-green/10 focus:border-farmx-green focus:bg-white transition-all text-gray-900 font-bold placeholder-gray-400 shadow-sm"
                  placeholder="name@farmxchain.com"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 px-1">
                  Secure Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-6 py-5 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-farmx-green/10 focus:border-farmx-green focus:bg-white transition-all text-gray-900 font-bold placeholder-gray-400 shadow-sm"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center group cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-10 h-6 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
                <span className="ml-3 text-sm font-bold text-gray-600">Keep me logged in</span>
              </label>

              <a href="#" className="text-sm font-black text-farmx-green hover:underline">
                Reset Access?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl shadow-farmx-green/25 text-lg font-black text-white bg-farmx-green hover:bg-farmx-green-dark focus:outline-none transition-all duration-300 overflow-hidden active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? 'Processing...' : 'Access Dashboard'}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            <div className="text-center mt-10">
              <p className="text-gray-500 font-bold">
                New to the platform?{' '}
                <Link to="/register" className="text-farmx-dark hover:text-farmx-green transition-colors border-b-2 border-farmx-green">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
