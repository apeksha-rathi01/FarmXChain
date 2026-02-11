import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Routes, Route } from 'react-router-dom';
import Layout from '../components/shared/Layout';
import FarmerDashboard from '../components/farmer/FarmerDashboard';
import AdminDashboard from '../components/admin/AdminDashboard';
import DistributorDashboard from '../components/distributor/DistributorDashboard';
import RetailerDashboard from '../components/retailer/RetailerDashboard';
import ConsumerDashboard from '../components/consumer/ConsumerDashboard';
import CropExplorer from '../components/explore/CropExplorer';
import CropForm from '../components/farmer/CropForm';
import CropList from '../components/farmer/CropList';
import FarmerProfile from '../components/farmer/FarmerProfile';
import BlockchainTraceability from '../components/farmer/BlockchainTraceability';
import InventoryManagement from '../components/shared/InventoryManagement';
import ConsumerTraceability from '../components/consumer/ConsumerTraceability';

export default function DashboardPage() {
  const { isAuthenticated, user, loading } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'ADMIN': return <AdminDashboard />;
      case 'DISTRIBUTOR': return <DistributorDashboard />;
      case 'RETAILER': return <RetailerDashboard />;
      case 'CONSUMER': return <ConsumerDashboard />;
      default: return <FarmerDashboard />;
    }
  };

  if (loading) {
    // ... loading state unchanged ...
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Routes>
          <Route path="/" element={renderDashboard()} />
          <Route path="/add-crop" element={user?.role === 'FARMER' ? <CropForm /> : <Navigate to="/dashboard" />} />
          <Route path="/my-crops" element={user?.role === 'FARMER' ? <CropList /> : <Navigate to="/dashboard" />} />
          <Route path="/crops" element={<CropExplorer />} />
          <Route path="/profile" element={user?.role === 'FARMER' ? <FarmerProfile /> : <Navigate to="/dashboard" />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/trace" element={<ConsumerTraceability />} />
          <Route path="/crop/:cropId" element={<BlockchainTraceability />} />
          <Route path="/traceability/:cropId" element={<BlockchainTraceability />} />
          <Route path="/traceability" element={<BlockchainTraceability />} />
        </Routes>
      </div>
    </Layout>
  );
}
