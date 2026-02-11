import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cropService } from '../../api/cropService';
import { formatDate, getStatusBadgeColor } from '../../utils/helpers';
import meshBg from '../../assets/dashboard-mesh.png';

export default function CropList() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingCropId, setUploadingCropId] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await cropService.getMycrops();
      setCrops(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading crops');
      console.error('Error fetching crops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTraceability = (cropId) => {
    navigate(`/dashboard/traceability/${cropId}`);
  };

  const handleCertificateUpload = async (cropId, file) => {
    if (!file) return;

    try {
      setUploadingCropId(cropId);
      setError('');
      await cropService.uploadCertificate(cropId, file);
      setUploadSuccess(`Certificate uploaded for crop #${cropId}`);
      setTimeout(() => setUploadSuccess(''), 3000);
      fetchCrops(); // Refresh to show updated certificate status
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading certificate');
    } finally {
      setUploadingCropId(null);
    }
  };

  const triggerFileInput = (cropId) => {
    const input = document.getElementById(`file-input-${cropId}`);
    if (input) input.click();
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-farmx-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Crop Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12 animate-fade-in">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
            <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Production Matrix</span>
          </div>
          <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
            My <span className="text-farmx-green">Harvests</span>.
          </h1>
        </div>
        {!loading && crops.length > 0 && (
          <button
            onClick={() => navigate('/dashboard/add-crop')}
            className="group relative bg-farmx-green text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-farmx-green-dark transition-all shadow-xl shadow-farmx-green/20 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-xl">+</span> Add Registration
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        )}
      </div>

      {error && (
        <div className="glass-card bg-red-50/50 border border-red-200 p-6 rounded-[2rem] mb-12 flex justify-between items-center text-red-700 animate-slide-up">
          <span className="font-black text-sm uppercase tracking-widest flex items-center gap-3">
            ⚠️ Protocol Error: {error}
          </span>
          <button onClick={() => setError('')} className="font-black hover:scale-110 transition-transform">×</button>
        </div>
      )}

      {uploadSuccess && (
        <div className="glass-card bg-green-50/50 border border-green-200 p-6 rounded-[2rem] mb-12 flex justify-between items-center text-green-700 animate-slide-up">
          <span className="font-black text-sm uppercase tracking-widest flex items-center gap-3">
            ✅ {uploadSuccess}
          </span>
          <button onClick={() => setUploadSuccess('')} className="font-black hover:scale-110 transition-transform">×</button>
        </div>
      )}

      {crops.length === 0 ? (
        <div className="glass-card bg-white/40 border border-white/60 p-20 text-center rounded-[3rem] shadow-2xl animate-fade-in">
          <div className="text-8xl mb-8 opacity-20">🚜</div>
          <h3 className="text-3xl font-black text-farmx-dark">Registry Empty</h3>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-[0.2em] text-xs mb-10">Initiate your first blockchain crop record.</p>
          <button
            onClick={() => navigate('/dashboard/add-crop')}
            className="bg-farmx-green text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-farmx-green/20 hover:scale-105 transition-all"
          >
            Start Registration
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crops.map((crop, index) => (
            <div
              key={crop.id}
              className="glass-card bg-white/40 border border-white/60 rounded-[2.5rem] shadow-2xl overflow-hidden group hover:shadow-farmx-green/10 transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-farmx-dark tracking-tight leading-tight group-hover:text-farmx-green transition-colors">{crop.cropName}</h3>
                    <p className="text-[10px] font-black text-farmx-green/60 uppercase tracking-widest mt-1">{crop.cropType}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusBadgeColor(crop.status)}`}>
                    {crop.status || 'Active'}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory</span>
                    <span className="text-sm font-black text-farmx-dark">{crop.quantity} <span className="text-gray-400">{crop.unit}</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recorded On</span>
                    <span className="text-sm font-black text-farmx-dark">{formatDate(crop.harvestDate)}</span>
                  </div>
                  {crop.qualityCertificate && (
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Certificate</span>
                      <span className="text-xs font-black text-green-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                {crop.blockchainHash && (
                  <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl mb-4 group/hash relative overflow-hidden">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-farmx-green rounded-full animate-pulse"></span>
                      Verified Hash
                    </p>
                    <p className="text-[10px] font-mono text-gray-500 truncate" title={crop.blockchainHash}>
                      {crop.blockchainHash}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-8 py-6 bg-white/30 border-t border-white/50 flex gap-4">
                <button
                  onClick={() => navigate(`/dashboard/crop/${crop.id}`)}
                  className="flex-1 py-3 px-4 bg-white border border-gray-100 text-farmx-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 hover:border-farmx-green/30 transition-all shadow-sm"
                >
                  Inspect
                </button>
                <button
                  onClick={() => handleViewTraceability(crop.id)}
                  className="flex-1 py-3 px-4 bg-farmx-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-farmx-green-dark transition-all shadow-lg shadow-farmx-green/10"
                >
                  Trace Identity
                </button>
              </div>

              {!crop.qualityCertificate && (
                <div className="px-8 pb-6">
                  <input
                    type="file"
                    id={`file-input-${crop.id}`}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleCertificateUpload(crop.id, e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    onClick={() => triggerFileInput(crop.id)}
                    disabled={uploadingCropId === crop.id}
                    className="w-full py-3 px-4 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingCropId === crop.id ? 'Uploading...' : '📄 Upload Certificate'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
