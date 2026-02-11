import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthService from "./api/authService";
import Logo from "./components/Logo";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import FarmerVerification from "./pages/FarmerVerification";
import UserManagement from "./pages/UserManagement";
import Statistics from "./pages/Statistics";
import FarmerList from "./pages/FarmerList";
import MarketplacePage from "./pages/MarketplacePage";
import OrderManagement from "./components/buyer/OrderManagement";
import SalesManagement from "./components/farmer/SalesManagement";
import FarmerAnalytics from "./pages/FarmerAnalytics";
import AdminAnalytics from "./pages/AdminAnalytics";
import DisputeManagement from "./pages/DisputeManagement";
import ProductJourney from "./pages/ProductJourney";
import BlockchainMonitor from "./pages/BlockchainMonitor";

// Utils
import AuthGuard from "./utils/AuthGuard.jsx";

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, loading, currentUser } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();

  const handleLogout = () => {
    AuthService.logout();
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-white/20 py-1 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-12">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="bg-farmx-green text-white p-2.5 rounded-[1.25rem] shadow-lg shadow-farmx-green/20 transition-transform group-hover:scale-105 group-hover:rotate-3">
                <Logo className="h-6 w-6 text-white" size="small" />
              </div>
              <span className="text-2xl font-black text-farmx-dark tracking-tighter">
                Farm<span className="text-farmx-green">X</span>Chain
              </span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/dashboard'
                    ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                    : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                    }`}
                >
                  Overview
                </Link>

                {(currentUser?.role === 'FARMER') && (
                  <>
                    <Link
                      to="/dashboard/my-crops"
                      className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/dashboard/my-crops'
                        ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                        : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                        }`}
                    >
                      My Crops
                    </Link>
                    <Link
                      to="/analytics"
                      className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/analytics'
                        ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                        : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                        }`}
                    >
                      Analytics
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/dashboard/profile'
                        ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                        : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                        }`}
                    >
                      Farm Identity
                    </Link>
                  </>
                )}

                {currentUser?.role === 'ADMIN' && (
                  <>
                    <Link
                      to="/farmer-verification"
                      className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/farmer-verification'
                        ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                        : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                        }`}
                    >
                      Audits
                    </Link>
                    <Link
                      to="/admin/analytics"
                      className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/admin/analytics'
                        ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                        : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                        }`}
                    >
                      Analytics
                    </Link>
                    <Link
                      to="/admin/disputes"
                      className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/admin/disputes'
                        ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                        : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                        }`}
                    >
                      Disputes
                    </Link>
                    <Link
                      to="/user-management"
                      className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/user-management'
                        ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                        : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                        }`}
                    >
                      User Logic
                    </Link>
                  </>
                )}

                {(['DISTRIBUTOR', 'RETAILER', 'CONSUMER'].includes(currentUser?.role)) && (
                  <>
                    <Link
                      to="/marketplace"
                      className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/marketplace'
                        ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                        : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                        }`}
                    >
                      Marketplace
                    </Link>
                    <Link
                      to="/orders"
                      className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/orders'
                        ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                        : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                        }`}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/dashboard/crops"
                      className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/dashboard/crops'
                        ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                        : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                        }`}
                    >
                      Explorer
                    </Link>
                    <Link
                      to="/dashboard/trace"
                      className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/dashboard/trace'
                        ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                        : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                        }`}
                    >
                      Trace
                    </Link>
                  </>
                )}

                {(['FARMER', 'DISTRIBUTOR', 'RETAILER'].includes(currentUser?.role)) && (
                  <Link
                    to="/sales"
                    className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${location.pathname === '/sales'
                      ? 'bg-farmx-green text-white shadow-lg shadow-farmx-green/20'
                      : 'text-gray-500 hover:text-farmx-green hover:bg-farmx-green/5'
                      }`}
                  >
                    Sales
                  </Link>
                )}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-farmx-green to-emerald-600 flex items-center justify-center text-white font-black text-xs">
                  {currentUser?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-gray-900 leading-none">{currentUser?.email?.split('@')[0]}</p>
                  <p className="text-[9px] font-black text-farmx-green uppercase tracking-widest mt-1">{currentUser?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="group relative bg-farmx-dark hover:bg-red-600 text-white px-6 py-3 rounded-2xl text-xs font-black transition-all duration-300 shadow-xl shadow-farmx-dark/10 hover:shadow-red-500/20 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Disconnect
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

import LandingPage from "./pages/LandingPage";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/trace/:id" element={<ProductJourney />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer-verification"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <FarmerVerification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Statistics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/disputes"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <DisputeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blockchain-monitor"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <BlockchainMonitor />
            </ProtectedRoute>
          }
        />

        {/* Farmer List (for DISTRIBUTOR, RETAILER, CONSUMER) */}
        <Route
          path="/farmer-list"
          element={
            <ProtectedRoute>
              <FarmerList />
            </ProtectedRoute>
          }
        />

        {/* Marketplace & Orders Routes - Milestone 3 */}
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute requiredRole="FARMER">
              <FarmerAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
