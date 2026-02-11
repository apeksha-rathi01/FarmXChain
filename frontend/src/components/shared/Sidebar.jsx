import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = {
    FARMER: [
      { label: 'Overview', path: '/dashboard' },
      { label: 'Farm Identity', path: '/dashboard/profile' },
      { label: 'Register Crop', path: '/dashboard/add-crop' },
      { label: 'My Inventory', path: '/dashboard/my-crops' },
      { label: 'Blockchain Audit', path: '/dashboard/traceability' },
    ],
    ADMIN: [
      { label: 'Control Center', path: '/dashboard' },
      { label: 'Farmer Verifications', path: '/dashboard/farmers' },
      { label: 'Global Inventory', path: '/dashboard/crops' },
      { label: 'Network Stats', path: '/dashboard/stats' },
    ],
    DISTRIBUTOR: [
      { label: 'Logistics Hub', path: '/dashboard' },
      { label: 'Ecosystem Explorer', path: '/dashboard/crops' },
      { label: 'Distribution Log', path: '/dashboard/orders' },
    ],
    RETAILER: [
      { label: 'Quality Hub', path: '/dashboard' },
      { label: 'Sourcing Explorer', path: '/dashboard/crops' },
      { label: 'Store Inventory', path: '/dashboard/inventory' },
    ],
    CONSUMER: [
      { label: 'Transparency Hub', path: '/dashboard' },
      { label: 'Crop Explorer', path: '/dashboard/crops' },
      { label: 'Trace My Food', path: '/dashboard/traceability' },
    ],
  };

  const items = menuItems[user?.role] || menuItems.CONSUMER;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-green-700 mb-6">
          {user?.role} Menu
        </h2>

        <nav className="space-y-2">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${isActive(item.path)
                  ? 'bg-green-100 text-green-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
