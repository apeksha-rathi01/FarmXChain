import React, { useState, useEffect, useCallback } from 'react';
import AdminService from '../services/AdminService';
import meshBg from '../assets/dashboard-mesh.png';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await AdminService.getAllUsers();
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }
    if (filterRole) filtered = filtered.filter(user => user.role === filterRole);
    if (filterStatus) filtered = filtered.filter(user => user.status === filterStatus);
    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, filterStatus, users]);

  const handleVerifyUser = async (userId) => {
    try {
      setProcessing(true);
      await AdminService.verifyUser(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'VERIFIED' } : u));
    } catch (err) {
      setError('Failed to verify user');
    } finally {
      setProcessing(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      setProcessing(true);
      await AdminService.suspendUser(userId, 'Suspended by admin');
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'SUSPENDED' } : u));
    } catch (err) {
      setError('Failed to suspend user');
    } finally {
      setProcessing(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      setProcessing(true);
      await AdminService.activateUser(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'ACTIVE' } : u));
    } catch (err) {
      setError('Failed to activate user');
    } finally {
      setProcessing(false);
    }
  };

  const getRoleBadgeStyle = (role) => {
    const base = "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ";
    switch (role) {
      case 'ADMIN': return base + "bg-red-50 text-red-600 border-red-100";
      case 'FARMER': return base + "bg-farmx-green/10 text-farmx-green border-farmx-green/20";
      case 'DISTRIBUTOR': return base + "bg-blue-50 text-blue-600 border-blue-100";
      case 'RETAILER': return base + "bg-purple-50 text-purple-600 border-purple-100";
      default: return base + "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const getStatusBadgeStyle = (status) => {
    const base = "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ";
    switch (status) {
      case 'ACTIVE': return base + "bg-green-500 text-white shadow-lg shadow-green-500/20";
      case 'VERIFIED': return base + "bg-blue-500 text-white shadow-lg shadow-blue-500/20";
      case 'PENDING': return base + "bg-yellow-400 text-white shadow-lg shadow-yellow-400/20";
      case 'SUSPENDED': return base + "bg-red-500 text-white shadow-lg shadow-red-500/20";
      default: return base + "bg-gray-400 text-white";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-farmx-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Identity Layer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${meshBg})`, backgroundSize: 'cover' }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-12 animate-fade-in">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
              <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Identity Matrix</span>
            </div>
            <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
              User <span className="text-farmx-green">Control</span>.
            </h1>
          </div>
          <div className="bg-white/50 backdrop-blur-md border border-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl shadow-gray-200/50">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Node Count</span>
            <span className="text-2xl font-black text-farmx-dark leading-none">{filteredUsers.length}</span>
          </div>
        </div>

        {/* Filter Glass-Card */}
        <div className="glass-card p-8 mb-12 bg-white/40 border border-white/60 rounded-[2.5rem] shadow-2xl animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative col-span-1 md:col-span-2">
              <input
                type="text"
                placeholder="Search Identity Signature..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/80 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-farmx-green/5 focus:border-farmx-green font-bold text-sm transition-all"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-6 py-4 bg-white/80 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-farmx-green font-bold text-xs uppercase tracking-widest appearance-none cursor-pointer"
            >
              <option value="">All Roles</option>
              {['ADMIN', 'FARMER', 'DISTRIBUTOR', 'RETAILER', 'CONSUMER'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <button
              onClick={() => { setSearchTerm(''); setFilterRole(''); setFilterStatus(''); }}
              className="bg-farmx-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card overflow-hidden shadow-2xl border border-white/60 bg-white/40 rounded-[2.5rem] animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Identity</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Assigned Role</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Status</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {filteredUsers.map((user, i) => (
                  <tr key={user.id} className="hover:bg-white/50 transition-colors duration-300 group">
                    <td className="px-10 py-8 whitespace-nowrap">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-farmx-dark font-black text-lg border border-white group-hover:scale-110 transition-transform">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-farmx-dark">{user.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 whitespace-nowrap">
                      <span className={getRoleBadgeStyle(user.role)}>{user.role}</span>
                    </td>
                    <td className="px-10 py-8 whitespace-nowrap">
                      <span className={getStatusBadgeStyle(user.status)}>{user.status}</span>
                    </td>
                    <td className="px-10 py-8 whitespace-nowrap">
                      <div className="flex gap-4">
                        {user.status === 'PENDING' && (
                          <button
                            onClick={() => handleVerifyUser(user.id)}
                            className="bg-farmx-green text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-farmx-green-dark transition-all shadow-lg shadow-farmx-green/20"
                          >
                            Authorize
                          </button>
                        )}
                        {user.status !== 'SUSPENDED' ? (
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className="bg-white border border-red-100 text-red-500 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all"
                          >
                            Disconnect
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(user.id)}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all"
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
