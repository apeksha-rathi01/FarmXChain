import React, { useState, useEffect } from 'react';
import { orderService } from '../../api/orderService';
import { shipmentService } from '../../api/shipmentService';
import DisputeService from '../../services/DisputeService';
import meshBg from '../../assets/dashboard-mesh.png';

export default function SalesManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showShipmentModal, setShowShipmentModal] = useState(false);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [disputeData, setDisputeData] = useState({ reason: 'PAYMENT_DISPUTE', description: '' });
    const [shipmentData, setShipmentData] = useState({
        currentLocation: '',
        transportMode: 'TRUCK',
        carrierName: '',
        estimatedDelivery: '',
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getMySales();
            setOrders(response.data || []);
        } catch (err) {
            setError('Failed to load orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptOrder = async (orderId) => {
        try {
            await orderService.acceptOrder(orderId);
            setSuccess('Order accepted! Blockchain ownership transfer initiated.');
            fetchOrders();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to accept order');
        }
    };

    const handleRejectOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to reject this order?')) return;
        try {
            await orderService.rejectOrder(orderId);
            setSuccess('Order rejected.');
            fetchOrders();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reject order');
        }
    };

    const handleSimulateMovement = async (orderId) => {
        try {
            const shipmentResponse = await shipmentService.getShipmentByOrder(orderId);
            await shipmentService.simulateMovement(shipmentResponse.data.id);
            setSuccess('Shipment telemetry updated! (If at Last Mile, it may double-check to deliver)');
            fetchOrders();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to simulate movement: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleMarkDelivered = async (orderId) => {
        if (!window.confirm('Mark this order as manually DELIVERED?')) return;
        try {
            const shipmentResponse = await shipmentService.getShipmentByOrder(orderId);
            await shipmentService.updateStatus(shipmentResponse.data.id, 'DELIVERED');
            setSuccess('Order marked as delivered successfully!');
            fetchOrders();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to mark delivered: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleCreateShipment = async () => {
        if (!shipmentData.currentLocation || !shipmentData.carrierName) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            const payload = {
                orderId: selectedOrder.id,
                ...shipmentData,
                estimatedDelivery: shipmentData.estimatedDelivery ? new Date(shipmentData.estimatedDelivery).toISOString() : null,
            };

            await shipmentService.createShipment(payload);
            setSuccess('Shipment created successfully!');
            setShowShipmentModal(false);
            setShipmentData({ currentLocation: '', transportMode: 'TRUCK', carrierName: '', estimatedDelivery: '' });
            fetchOrders();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create shipment');
        }
    };

    const handleCreateDispute = async () => {
        if (!disputeData.description.trim()) {
            alert('Please provide a description');
            return;
        }

        try {
            const payload = {
                orderId: selectedOrder.id,
                reportedAgainstId: selectedOrder.buyer.id,
                reason: disputeData.reason,
                description: disputeData.description
            };
            await DisputeService.createDispute(payload);
            setSuccess('Dispute reported successfully. An administrator will review the case.');
            setShowDisputeModal(false);
            setDisputeData({ reason: 'PAYMENT_DISPUTE', description: '' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to report dispute');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            REQUESTED: 'bg-yellow-100 text-yellow-700',
            ACCEPTED: 'bg-blue-100 text-blue-700',
            REJECTED: 'bg-red-100 text-red-700',
            SHIPPED: 'bg-purple-100 text-purple-700',
            DELIVERED: 'bg-green-100 text-green-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <div className="w-16 h-16 border-4 border-farmx-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Sales...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden font-sans pb-12">
            <div
                className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: `url(${meshBg})`, backgroundSize: 'cover' }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-1 w-12 bg-farmx-green rounded-full"></div>
                        <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Sales Dashboard</span>
                    </div>
                    <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
                        Incoming <span className="text-farmx-green">Orders</span>.
                    </h1>
                </div>

                {error && (
                    <div className="glass-card bg-red-50/50 border border-red-200 p-6 rounded-[2rem] mb-8 flex justify-between items-center text-red-700">
                        <span className="font-black text-sm uppercase tracking-widest">⚠️ {error}</span>
                        <button onClick={() => setError('')} className="font-black hover:scale-110 transition-transform">×</button>
                    </div>
                )}

                {success && (
                    <div className="glass-card bg-green-50/50 border border-green-200 p-6 rounded-[2rem] mb-8 flex justify-between items-center text-green-700">
                        <span className="font-black text-sm uppercase tracking-widest">✅ {success}</span>
                        <button onClick={() => setSuccess('')} className="font-black hover:scale-110 transition-transform">×</button>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="glass-card bg-white/40 border border-white/60 p-20 text-center rounded-[3rem]">
                        <div className="text-8xl mb-8 opacity-20">📦</div>
                        <h3 className="text-3xl font-black text-farmx-dark">No Orders Yet</h3>
                        <p className="text-gray-400 font-bold mt-2 uppercase tracking-[0.2em] text-xs">Orders will appear here when buyers purchase your crops</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="glass-card bg-white/40 border border-white/60 rounded-[2rem] p-8 hover:shadow-farmx-green/10 transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-farmx-dark">{order.crop?.cropName}</h3>
                                        <p className="text-sm font-bold text-gray-500 mt-1">Order #{order.id} from {order.buyer?.name}</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</p>
                                        <p className="text-lg font-black text-farmx-dark">{order.quantity} {order.crop?.unit}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Price</p>
                                        <p className="text-lg font-black text-farmx-green">₹{order.totalPrice}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
                                        <p className="text-sm font-black text-farmx-dark">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Buyer Email</p>
                                        <p className="text-sm font-black text-farmx-dark">{order.buyer?.email}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    {order.status === 'REQUESTED' && (
                                        <div className="flex-1 flex gap-4">
                                            <button
                                                onClick={() => handleAcceptOrder(order.id)}
                                                className="flex-1 py-3 bg-farmx-green text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-farmx-green-dark transition-all"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleRejectOrder(order.id)}
                                                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    {order.status === 'ACCEPTED' && (
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowShipmentModal(true);
                                            }}
                                            className="flex-1 py-3 bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                                        >
                                            Create Shipment
                                        </button>
                                    )}
                                    {(order.status === 'SHIPPED') && (
                                        <div className="flex-1 flex gap-2">
                                            <button
                                                onClick={() => handleSimulateMovement(order.id)}
                                                className="flex-1 py-3 bg-farmx-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-farmx-green transition-all"
                                            >
                                                Simulate Move
                                            </button>
                                            <button
                                                onClick={() => handleMarkDelivered(order.id)}
                                                className="flex-1 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all"
                                            >
                                                Mark Delivered
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowDisputeModal(true);
                                        }}
                                        className="px-6 py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                                    >
                                        Report Issue
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Shipment Creation Modal */}
            {showShipmentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
                    <div className="glass-card bg-white/90 border border-white/60 rounded-[3rem] shadow-2xl max-w-lg w-full p-10 my-8">
                        <h2 className="text-3xl font-black text-farmx-dark mb-6">Create Shipment</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 block">Current Location *</label>
                                <input
                                    type="text"
                                    value={shipmentData.currentLocation}
                                    onChange={(e) => setShipmentData({ ...shipmentData, currentLocation: e.target.value })}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-farmx-green outline-none font-bold text-sm"
                                    placeholder="e.g., Warehouse, City"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 block">Transport Mode</label>
                                <select
                                    value={shipmentData.transportMode}
                                    onChange={(e) => setShipmentData({ ...shipmentData, transportMode: e.target.value })}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-farmx-green outline-none font-bold text-sm"
                                >
                                    <option value="TRUCK">Truck</option>
                                    <option value="RAIL">Rail</option>
                                    <option value="AIR">Air</option>
                                    <option value="SEA">Sea</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 block">Carrier Name *</label>
                                <input
                                    type="text"
                                    value={shipmentData.carrierName}
                                    onChange={(e) => setShipmentData({ ...shipmentData, carrierName: e.target.value })}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-farmx-green outline-none font-bold text-sm"
                                    placeholder="e.g., ABC Logistics"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 block">Estimated Delivery</label>
                                <input
                                    type="datetime-local"
                                    value={shipmentData.estimatedDelivery}
                                    onChange={(e) => setShipmentData({ ...shipmentData, estimatedDelivery: e.target.value })}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-farmx-green outline-none font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => {
                                    setShowShipmentModal(false);
                                    setShipmentData({ currentLocation: '', transportMode: 'TRUCK', carrierName: '', estimatedDelivery: '' });
                                }}
                                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateShipment}
                                className="flex-1 py-4 bg-farmx-green text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-farmx-green-dark transition-all shadow-lg shadow-farmx-green/20"
                            >
                                Create Shipment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dispute Reporting Modal */}
            {showDisputeModal && selectedOrder && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="glass-card bg-white border border-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-black text-farmx-dark mb-6 tracking-tight">Report Issue</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Dispute category</label>
                                <select
                                    value={disputeData.reason}
                                    onChange={(e) => setDisputeData({ ...disputeData, reason: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-farmx-green outline-none font-bold text-sm"
                                >
                                    <option value="PAYMENT_DISPUTE">Payment Dispute</option>
                                    <option value="QUALITY_ISSUE">Quality Issue</option>
                                    <option value="NON_DELIVERY">Non-Delivery</option>
                                    <option value="QUANTITY_MISMATCH">Quantity Mismatch</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Resolution Request Details</label>
                                <textarea
                                    value={disputeData.description}
                                    onChange={(e) => setDisputeData({ ...disputeData, description: e.target.value })}
                                    placeholder="Describe the issue and your desired resolution..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-farmx-green outline-none font-bold text-sm min-h-[120px]"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setShowDisputeModal(false)}
                                className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateDispute}
                                className="flex-1 py-4 bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                            >
                                Report Dispute
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
