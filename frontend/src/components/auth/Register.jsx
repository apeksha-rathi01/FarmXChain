import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../api/authService';
import { validateEmail, validatePassword, getPasswordStrength } from '../../utils/validation';
import Logo from '../Logo';
import '../auth/Auth.css';
import bgPremium from '../../assets/bg-premium.png';
import heroRegister from '../../assets/hero-register.png';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'FARMER',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and numbers');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (response.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] rotate-1 scale-110"
        style={{ backgroundImage: `url(${bgPremium})`, filter: 'brightness(0.4)' }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex w-full max-w-6xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in mx-4">
        {/* Left Side: Register Form */}
        <div className="w-full lg:w-[55%] p-10 lg:p-16 glass-card">
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-farmx-green text-white p-2.5 rounded-2xl shadow-lg shadow-farmx-green/30">
                <Logo className="h-6 w-6 text-white" size="small" />
              </div>
              <span className="text-2xl font-black text-farmx-dark tracking-tighter">
                Farm<span className="text-farmx-green">X</span>Chain
              </span>
            </div>

            <h2 className="text-4xl font-black text-farmx-dark mb-3 tracking-tight">
              Join the Network.
            </h2>
            <p className="text-gray-500 font-semibold text-lg">
              Empowering farmers with blockchain technology.
            </p>
          </div>

          <form className="space-y-5 animate-slide-up" style={{ animationDelay: '0.1s' }} onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/50 backdrop-blur-sm border border-red-200 text-red-700 px-6 py-3 rounded-2xl flex justify-between items-center text-sm">
                <span className="font-bold flex items-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </span>
              </div>
            )}

            {success && (
              <div className="bg-green-50/50 backdrop-blur-sm border border-farmx-green/30 text-green-700 px-6 py-3 rounded-2xl flex justify-between items-center text-sm">
                <span className="font-bold">✨ {success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 px-1">
                  Identity
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-farmx-green/10 focus:border-farmx-green focus:bg-white transition-all text-gray-900 font-bold placeholder-gray-400"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 px-1">
                  Communication
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-farmx-green/10 focus:border-farmx-green focus:bg-white transition-all text-gray-900 font-bold placeholder-gray-400"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="group md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 px-1">
                  Your Role in Ecosystem
                </label>
                <select
                  name="role"
                  required
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-farmx-green/10 focus:border-farmx-green focus:bg-white transition-all text-gray-900 font-bold appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="FARMER">👨‍🌾 Farmer</option>
                  <option value="DISTRIBUTOR">🚚 Distributor</option>
                  <option value="RETAILER">🏪 Retailer</option>
                  <option value="CONSUMER">👥 Consumer</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 px-1">
                  Access Key
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-farmx-green/10 focus:border-farmx-green focus:bg-white transition-all text-gray-900 font-bold placeholder-gray-400"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {passwordStrength && (
                  <div className="mt-1 flex gap-1 items-center px-1">
                    <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'Strong' ? 'bg-farmx-green' : passwordStrength === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase">{passwordStrength}</span>
                  </div>
                )}
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 px-1">
                  Verify Key
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-farmx-green/10 focus:border-farmx-green focus:bg-white transition-all text-gray-900 font-bold placeholder-gray-400"
                  placeholder="Repeat Access Key"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center py-2 px-1">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-md border-gray-300 text-farmx-green focus:ring-farmx-green"
                />
                <span className="ml-3 text-sm font-bold text-gray-600">
                  Agree to <span className="text-farmx-green underline">Terms & Protocol</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex justify-center py-5 px-4 rounded-2xl shadow-xl shadow-farmx-green/25 text-lg font-black text-white bg-farmx-green hover:bg-farmx-green-dark focus:outline-none transition-all duration-300 overflow-hidden active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? 'Initializing...' : 'Create My Account'}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-500 font-bold">
                Already part of the network?{' '}
                <Link to="/login" className="text-farmx-dark hover:text-farmx-green border-b-2 border-farmx-green transition-all">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Side: Hero Image */}
        <div className="hidden lg:flex w-[45%] relative">
          <img
            src={heroRegister}
            alt="Community"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-farmx-dark/90 flex flex-col justify-end p-12">
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
              A community of <span className="text-farmx-green italic underline">Trust.</span>
            </h1>
            <p className="text-gray-200 font-medium text-lg leading-relaxed">
              We're building the infrastructure for a more resilient and profitable food system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
