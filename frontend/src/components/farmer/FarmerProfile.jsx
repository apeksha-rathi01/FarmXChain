import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { farmerService } from '../../api/farmerService';
import { validatePhoneNumber, validateLandArea } from '../../utils/validation';
import meshBg from '../../assets/dashboard-mesh.png';

export default function FarmerProfile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    farmName: '',
    phoneNumber: '',
    landArea: '',
    landUnit: 'HECTARES',
    primaryCrop: '',
    soilType: '',
    location: '',
    state: '',
    district: '',
    bankAccountNumber: '',
    ifscCode: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await farmerService.getProfile();
      setFormData(response.data || formData);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.farmName || !formData.phoneNumber || !formData.landArea) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    if (!validateLandArea(formData.landArea)) {
      setError('Please enter a valid land area');
      return;
    }

    try {
      setSaving(true);
      await farmerService.updateFarmDetails(formData);
      setSuccess('Profile identity updated and synched.');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-farmx-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
      <div className="flex items-center justify-between mb-12 animate-fade-in">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
            <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Master Identity</span>
          </div>
          <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
            Farm <span className="text-farmx-green">Profile</span>.
          </h1>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-black text-gray-400 hover:text-farmx-dark uppercase tracking-widest transition-colors"
        >
          ← Return to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 animate-slide-up">
          <div className="glass-card bg-white/40 border border-white/60 p-10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-farmx-green to-emerald-500"></div>

            <div className="relative inline-block mb-8">
              <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-farmx-green to-emerald-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl rotate-3 group-hover:rotate-6 transition-transform">
                {currentUser?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <h3 className="text-2xl font-black text-farmx-dark tracking-tight">{currentUser?.email?.split('@')[0]}</h3>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${formData.approved ? 'text-farmx-green' : 'text-amber-500'}`}>
              {formData.approved ? 'Verified Producer' : 'Verification Pending'}
            </p>

            <div className="mt-10 pt-10 border-t border-gray-100/50 space-y-6">
              <div className="flex justify-between items-center text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Status</span>
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg uppercase tracking-widest">Active</span>
              </div>
              <div className="flex justify-between items-center text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auth Level</span>
                <span className="text-[10px] font-black text-farmx-dark bg-gray-50 px-3 py-1 rounded-lg uppercase tracking-widest">{currentUser?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Data */}
        <div className="lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card bg-white/40 border border-white/60 p-12 rounded-[3.5rem] shadow-2xl min-h-[500px]">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-farmx-dark tracking-tight">Identity Matrix</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-farmx-dark text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-farmx-green transition-all shadow-xl shadow-farmx-dark/10"
                >
                  Modify Records
                </button>
              )}
            </div>

            {error && (
              <div className="p-6 bg-red-50/50 border border-red-200 rounded-[2rem] mb-10 text-red-700 flex justify-between items-center animate-shake">
                <span className="font-black text-xs uppercase tracking-widest">⚠️ Sync Interrupt: {error}</span>
                <button onClick={() => setError('')} className="font-black">×</button>
              </div>
            )}

            {success && (
              <div className="p-6 bg-farmx-green/10 border border-farmx-green/20 rounded-[2rem] mb-10 text-farmx-green flex justify-between items-center">
                <span className="font-black text-xs uppercase tracking-widest">✓ {success}</span>
                <button onClick={() => setSuccess('')} className="font-black">×</button>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Farm Descriptor</label>
                    <input
                      type="text"
                      name="farmName"
                      value={formData.farmName}
                      onChange={handleChange}
                      className="w-full bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Neural Link (Phone)</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Spatial Coverage</label>
                    <div className="flex gap-4">
                      <input
                        type="number"
                        name="landArea"
                        value={formData.landArea}
                        onChange={handleChange}
                        className="flex-1 bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all"
                      />
                      <select
                        name="landUnit"
                        value={formData.landUnit}
                        onChange={handleChange}
                        className="w-32 bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all"
                      >
                        <option value="HECTARES">HA</option>
                        <option value="ACRES">AC</option>
                        <option value="BIGHA">BG</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Primary Specimen</label>
                    <input
                      type="text"
                      name="primaryCrop"
                      value={formData.primaryCrop}
                      onChange={handleChange}
                      className="w-full bg-white/50 border border-white/80 p-5 rounded-2xl font-bold text-farmx-dark focus:border-farmx-green focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-6 pt-10">
                  <button
                    type="submit"
                    disabled={saving}
                    className="group relative flex-1 bg-farmx-green text-white p-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all shadow-2xl hover:shadow-farmx-green/30"
                  >
                    <span className="relative z-10">{saving ? 'Syncing...' : 'Confirm Matrix Update'}</span>
                    <div className="absolute inset-0 bg-farmx-dark translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-10 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-farmx-dark transition-all border border-gray-100 hover:border-gray-200"
                  >
                    Abort
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="group">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2 group-hover:text-farmx-green transition-colors">Farm Identity</p>
                    <p className="text-xl font-black text-farmx-dark tracking-tight">{formData.farmName || 'Unregistered Domain'}</p>
                  </div>
                  <div className="group">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2 group-hover:text-farmx-green transition-colors">Verified Contact</p>
                    <p className="text-xl font-black text-farmx-dark tracking-tight">{formData.phoneNumber || 'Silent Node'}</p>
                  </div>
                  <div className="group">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2 group-hover:text-farmx-green transition-colors">Territory Scale</p>
                    <p className="text-xl font-black text-farmx-dark tracking-tight">{formData.landArea} <span className="text-gray-300 text-sm">{formData.landUnit}</span></p>
                  </div>
                  <div className="group">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2 group-hover:text-farmx-green transition-colors">Core Specialization</p>
                    <p className="text-xl font-black text-farmx-dark tracking-tight">{formData.primaryCrop || 'General Agriculture'}</p>
                  </div>
                </div>

                <div className="p-10 bg-farmx-green/5 border border-farmx-green/10 rounded-[3rem] group">
                  <h4 className="text-[10px] font-black text-farmx-green uppercase tracking-[0.3em] mb-4">Network Localization</h4>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">
                    {formData.location || formData.district || formData.state
                      ? `${formData.location || 'Pending'}, ${formData.district || 'Pending'}, ${formData.state || 'Pending'}`
                      : 'Localization mapping in progress...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
