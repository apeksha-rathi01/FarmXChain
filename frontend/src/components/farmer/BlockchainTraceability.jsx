import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blockchainService } from '../../api/blockchainService';
import { cropService } from '../../api/cropService';
import { formatDateTime, getRelativeTime, formatDate } from '../../utils/helpers';
import meshBg from '../../assets/dashboard-mesh.png';
import QRCode from 'qrcode';


export default function BlockchainTraceability() {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [traceability, setTraceability] = useState([]);
  const [blockchainRecord, setBlockchainRecord] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cropId) {
      fetchTraceability();
    }
  }, [cropId]);

  const fetchTraceability = async () => {
    try {
      setLoading(true);
      const cropResponse = await cropService.getCropById(cropId);
      setCrop(cropResponse.data);

      const blockchainResponse = await blockchainService.getBlockchainRecord(cropId);
      setBlockchainRecord(blockchainResponse.data);

      const traceabilityResponse = await blockchainService.getTraceability(cropId);
      setTraceability(traceabilityResponse.data || []);

      // Generate QR Code for product labeling
      const url = `${window.location.origin}/trace/${cropId}`;
      const qr = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#00A86B',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(qr);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading traceability data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      const response = await blockchainService.verifyCropData(cropId);
      if (response.data.verified) {
        alert('✓ Cryptographic Proof Validated: All blockchain records are authentic.');
      } else {
        alert('⚠ Integrity Alert: Data mismatch detected in current record.');
      }
    } catch (err) {
      alert('Verification node unreachable.');
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
            <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Supply Chain Integrity</span>
          </div>
          <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
            Traceability <span className="text-farmx-green">Matrix</span>.
          </h1>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-black text-gray-400 hover:text-farmx-dark uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          ← Previous Layer
        </button>
      </div>

      {error && (
        <div className="glass-card bg-red-50/50 border border-red-200 p-6 rounded-[2rem] mb-12 flex justify-between items-center text-red-700 animate-slide-up">
          <span className="font-black text-xs uppercase tracking-widest">⚠️ Access Denied: {error}</span>
          <button onClick={() => setError('')} className="font-black">×</button>
        </div>
      )}

      {crop && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-12 animate-slide-up">
            <div className="glass-card bg-white/40 border border-white/60 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-farmx-green/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-farmx-green/10 transition-colors"></div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
                <div>
                  <h2 className="text-3xl font-black text-farmx-dark tracking-tight mb-2">{crop.cropName}</h2>
                  <div className="flex items-center gap-3">
                    <span className="bg-farmx-green text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {crop.status || 'Active'}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{crop.cropType}</span>
                  </div>
                </div>
                <button
                  onClick={handleVerify}
                  className="bg-white/80 backdrop-blur-md border border-farmx-green/20 hover:border-farmx-green text-farmx-green px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-farmx-green/5 hover:scale-105 transition-all"
                >
                  Verify Cryptography
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-[#00A86B]/60">Mass Unit</p>
                  <p className="text-xl font-black text-farmx-dark leading-none">{crop.quantity} <span className="text-sm text-gray-400 uppercase">{crop.unit}</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-[#00A86B]/60">Genesis Date</p>
                  <p className="text-xl font-black text-farmx-dark leading-none">{formatDate(crop.harvestDate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-[#00A86B]/60">Source Node</p>
                  <p className="text-xl font-black text-farmx-dark leading-none truncate">{crop.location || 'Distributed'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-[#00A86B]/60">Substrate</p>
                  <p className="text-xl font-black text-farmx-dark leading-none">{crop.soilType || 'Natural'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="p-8 bg-farmx-green/5 border border-farmx-green/10 rounded-[2.5rem]">
                  <p className="text-[9px] font-black text-farmx-green uppercase tracking-widest mb-4">Verified Producer</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-farmx-green flex items-center justify-center text-white text-xl font-black shadow-lg">
                      {crop.farmerName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-lg font-black text-farmx-dark tracking-tight">{crop.farmerName || 'Anonymous Node'}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{crop.farmName || 'Independent Farm'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-white border-2 border-dashed border-farmx-green/20 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                  <p className="text-[9px] font-black text-farmx-green uppercase tracking-widest mb-3">Product QR Label</p>
                  {qrCodeUrl ? (
                    <>
                      <img src={qrCodeUrl} alt="Crop QR" className="w-24 h-24 mb-3" />
                      <div className="space-y-2">
                        <a
                          href={qrCodeUrl}
                          download={`crop-${cropId}-label.png`}
                          className="text-[10px] font-black text-gray-400 hover:text-farmx-green uppercase tracking-widest transition-colors block"
                        >
                          Download Label
                        </a>
                        <p className="text-[8px] font-mono text-gray-300 break-all max-w-[150px] mx-auto">
                          {window.location.origin}/trace/{cropId}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="w-24 h-24 bg-gray-50 rounded-xl animate-pulse"></div>
                  )}
                </div>
              </div>

              {crop.description && (
                <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100/50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Meta Narrative</p>
                  <p className="text-gray-500 font-bold text-sm leading-relaxed uppercase tracking-tighter">{crop.description}</p>
                </div>
              )}
            </div>

            {/* SUPPLY CHAIN TIMELINE */}
            <div className="glass-card bg-white/40 border border-white/60 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-black text-farmx-dark uppercase tracking-widest mb-12 flex items-center gap-4">
                <span className="w-8 h-8 bg-farmx-green rounded-xl flex items-center justify-center text-white text-xs">📍</span>
                Supply Chain Timeline
              </h3>

              {traceability.length === 0 ? (
                <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                  <div className="text-5xl opacity-20 mb-6">📦</div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No Supply Chain Movements Registered</p>
                </div>
              ) : (
                <div className="relative pl-12 space-y-12">
                  <div className="absolute left-4 top-2 bottom-2 w-1 bg-gradient-to-b from-farmx-green via-emerald-400 to-transparent rounded-full shadow-lg shadow-farmx-green/20"></div>
                  {traceability.map((record, index) => (
                    <div
                      key={record.id}
                      className="relative animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="absolute -left-[3.1rem] top-1 w-10 h-10 bg-white border-4 border-farmx-green rounded-2xl flex items-center justify-center shadow-xl z-10 transition-transform hover:scale-110">
                        <div className="w-2 h-2 bg-farmx-green rounded-full animate-pulse"></div>
                      </div>
                      <div className="p-8 bg-white/60 backdrop-blur-md border border-white/80 rounded-[2.5rem] shadow-xl hover:shadow-farmx-green/5 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <p className="text-xl font-black text-farmx-dark tracking-tight uppercase tracking-tighter">{record.stage || 'Transit Movement'}</p>
                          <span className="text-[9px] font-black text-farmx-green uppercase tracking-[0.2em] bg-farmx-green/5 px-3 py-1 rounded-lg">
                            {getRelativeTime(record.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-black text-gray-500 mb-4 uppercase tracking-widest">
                          <span className="opacity-50">📍 Location:</span> {record.location}
                        </div>
                        {record.notes && (
                          <p className="text-[11px] font-bold text-gray-400 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 uppercase tracking-tighter italic">
                            " {record.notes} "
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Blockchain Sidebar */}
          <div className="lg:col-span-4 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {blockchainRecord && (
              <div className="glass-card bg-farmx-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-farmx-green/10 to-transparent opacity-50"></div>

                <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-3 relative z-10">
                  <span className="w-1.5 h-6 bg-farmx-green rounded-full"></span>
                  Ledge Status
                </h3>

                <div className="space-y-8 relative z-10">
                  <div className="group/item">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover/item:text-farmx-green transition-colors">Transaction Hash</p>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl font-mono text-[9px] text-gray-300 break-all select-all hover:bg-white/10 transition-colors">
                      {blockchainRecord.transactionHash}
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Block Height</p>
                    <p className="font-black text-xl text-farmx-green">#{blockchainRecord.blockNumber}</p>
                  </div>

                  <div className="group/item">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover/item:text-farmx-green transition-colors">Consensus Agreement</p>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">Ethereum Mainnet Protocol • Proof of Authenticity Layer</p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Registry Timestamp</p>
                    <p className="text-sm font-black text-white">{formatDateTime(blockchainRecord.timestamp)}</p>
                  </div>
                </div>

                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-farmx-green/10 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
              </div>
            )}

            <div className="glass-card bg-white/40 border border-white/60 p-10 rounded-[3rem] shadow-2xl">
              <div className="text-4xl mb-6">🛡️</div>
              <h3 className="text-sm font-black text-farmx-dark uppercase tracking-widest mb-4">Cryptographic Shield</h3>
              <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">
                Supply chain data is cryptographically hashed and anchored to the global ledger.
                Any attempt to modify historical records will instantly trigger an verification failure.
                <span className="text-farmx-green block mt-4 font-black">100% Immutable • Verified</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
