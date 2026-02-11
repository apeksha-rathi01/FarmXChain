import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">FarmXChain</h1>
          <span className="text-xs bg-green-600 px-2 py-1 rounded">Blockchain</span>
        </div>

        <nav className="flex items-center gap-6">
          <span className="text-sm">
            Welcome, <strong>{user?.name}</strong>
          </span>
          <span className="bg-green-600 px-3 py-1 rounded text-xs font-semibold">
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
