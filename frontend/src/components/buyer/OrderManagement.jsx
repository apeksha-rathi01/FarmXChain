import React, { useState, useEffect } from 'react';
import { orderService } from '../../api/orderService';
import { shipmentService } from '../../api/shipmentService';
import { paymentService } from '../../api/paymentService';
import DisputeService from '../../services/DisputeService';
import meshBg from '../../assets/dashboard-mesh.png';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [shipment, setShipment] = useState(null);
    const [payment, setPayment] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [disputeData, setDisputeData] = useState({ reason: 'QUALITY_ISSUE', description: '' });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getMyPurchases();
            setOrders(response.data || []);
        } catch (err) {
            setError('Failed to load orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (order) => {
        setSelectedOrder(order);
        setShipment(null);
        setPayment(null);

        // Fetch Shipment
        if (order.status === 'ACCEPTED' || order.status === 'SHIPPED' || order.status === 'DELIVERED') {
            try {
                const shipmentResponse = await shipmentService.getShipmentByOrder(order.id);
                setShipment(shipmentResponse.data);
            } catch (err) {
                // Ignore error if shipment not found
            }
        }

        // Fetch Payment
        try {
            const paymentResponse = await paymentService.getPaymentByOrder(order.id);
            setPayment(paymentResponse.data);
        } catch (err) {
            // Ignore error
        }

        setShowDetailsModal(true);
    };

    const handlePayment = async () => {
        if (!window.confirm(`Initiate payment of ₹${selectedOrder.totalPrice}?`)) return;

        try {
            setProcessingPayment(true);
            const paymentData = {
                orderId: selectedOrder.id,
                amount: selectedOrder.totalPrice,
                paymentMethod: 'DIGITAL_WALLET'
            };
            const response = await paymentService.processPayment(paymentData);
            setPayment(response.data);
            setSuccess('Payment processed successfully! Transaction recorded on ledger.');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Payment failed');
        } finally {
            setProcessingPayment(false);
        }
    };

    const handleConfirmReceipt = async (orderId) => {
        if (!window.confirm('Confirm receipt of goods? This will finalize the transaction.')) return;

        try {
            // In simplified flow, DELIVERED is final. But user can manually mark delivered if not done by logistics
            await orderService.markAsDelivered(orderId);
            setSuccess('Order completed!');
            fetchOrders();
            setShowDetailsModal(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to complete order');
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
                reportedAgainstId: selectedOrder.seller.id,
                reason: disputeData.reason,
                description: disputeData.description
            };
            await DisputeService.createDispute(payload);
            setSuccess('Dispute reported successfully. An administrator will review the case.');
            setShowDisputeModal(false);
            setDisputeData({ reason: 'QUALITY_ISSUE', description: '' });
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
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Orders...</p>
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
                        <span className="text-xs font-black text-farmx-green uppercase tracking-[0.3em]">Purchase History</span>
                    </div>
                    <h1 className="text-5xl font-black text-farmx-dark tracking-tighter">
                        My <span className="text-farmx-green">Orders</span>.
                    </h1>
                </div>

                {error && (
                    <div className="glass-card bg-red-50/50 border border-red-200 p-6 rounded-[2rem] mb-8 animate-slide-up">
                        <span className="font-black text-sm text-red-700 uppercase tracking-widest">⚠️ {error}</span>
                        <button onClick={() => setError('')} className="float-right font-black">×</button>
                    </div>
                )}

                {success && (
                    <div className="glass-card bg-green-50/50 border border-green-200 p-6 rounded-[2rem] mb-8 animate-slide-up">
                        <span className="font-black text-sm text-green-700 uppercase tracking-widest">✅ {success}</span>
                        <button onClick={() => setSuccess('')} className="float-right font-black">×</button>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="glass-card bg-white/40 border border-white/60 p-20 text-center rounded-[3rem]">
                        <div className="text-8xl mb-8 opacity-20">📦</div>
                        <h3 className="text-3xl font-black text-farmx-dark">No Orders Yet</h3>
                        <p className="text-gray-400 font-bold mt-2 uppercase tracking-[0.2em] text-xs">Visit the marketplace to place your first order</p>
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
                                        <p className="text-sm font-bold text-gray-500 mt-1">Order #{order.id}</p>
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
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Seller</p>
                                        <p className="text-sm font-black text-farmx-dark">{order.seller?.name}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleViewDetails(order)}
                                        className="flex-1 py-3 bg-farmx-green text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-farmx-green-dark transition-all"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
                    <div className="glass-card bg-white/90 border border-white/60 rounded-[3rem] shadow-2xl max-w-2xl w-full p-10 my-8">
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="text-3xl font-black text-farmx-dark">Order Details</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-3xl font-black text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-gray-50 rounded-2xl">
                                <h3 className="text-lg font-black text-farmx-dark mb-4">Order Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase mb-1">Order ID</p>
                                        <p className="font-black text-farmx-dark">#{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase mb-1">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase ${getStatusColor(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase mb-1">Crop</p>
                                        <p className="font-black text-farmx-dark">{selectedOrder.crop?.cropName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase mb-1">Quantity</p>
                                        <p className="font-black text-farmx-dark">{selectedOrder.quantity} {selectedOrder.crop?.unit}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase mb-1">Price/Unit</p>
                                        <p className="font-black text-farmx-green">₹{selectedOrder.pricePerUnit}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase mb-1">Total</p>
                                        <p className="font-black text-farmx-green">₹{selectedOrder.totalPrice}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <h3 className="text-lg font-black text-farmx-dark mb-4">Payment Status</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase mb-1">Transaction State</p>
                                        {payment && payment.status ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black uppercase tracking-widest">
                                                PAID
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-black uppercase tracking-widest">
                                                UNPAID
                                            </span>
                                        )}
                                    </div>
                                    {payment && (
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-400 uppercase mb-1">Transaction ID</p>
                                            <p className="font-black text-farmx-dark text-xs">{payment.transactionId}</p>
                                            <p className="text-[10px] items-center text-gray-400">{new Date(payment.completedAt).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {shipment && (
                                <div className="p-8 bg-farmx-green/5 border border-farmx-green/20 rounded-[2.5rem] relative overflow-hidden">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 bg-farmx-green rounded-xl flex items-center justify-center text-white text-lg shadow-lg">📍</div>
                                        <h3 className="text-xl font-black text-farmx-dark">Logistics Timeline</h3>
                                    </div>

                                    <div className="relative pl-8 space-y-12">
                                        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-farmx-green/20"></div>

                                        {/* Status Steps - Simplified Flow */}
                                        {[
                                            { label: 'Order Requested', status: 'REQUESTED', icon: '📝' },
                                            { label: 'Accepted', status: 'ACCEPTED', icon: '✅' },
                                            { label: 'Shipped', status: 'SHIPPED', icon: '🚛' },
                                            { label: 'Delivered', status: 'DELIVERED', icon: '🏠' }
                                        ].map((step, idx) => {
                                            const statuses = ['REQUESTED', 'ACCEPTED', 'SHIPPED', 'DELIVERED'];
                                            const currentIdx = statuses.indexOf(selectedOrder.status);
                                            const stepIdx = statuses.indexOf(step.status);
                                            const isActive = currentIdx >= stepIdx;

                                            return (
                                                <div key={idx} className={`relative flex items-center gap-6 transition-all ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                                                    <div className={`absolute -left-[31px] w-6 h-6 rounded-full border-4 border-white shadow-md z-10 ${isActive ? 'bg-farmx-green' : 'bg-gray-200'}`}></div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{step.label}</span>
                                                        <span className="text-sm font-black text-farmx-dark">{isActive ? 'Completed' : 'Pending'}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-10 p-6 bg-white/60 rounded-2xl border border-white/80">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Coordinates</p>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[9px] font-black uppercase tracking-widest animate-pulse">Tracking Active</span>
                                        </div>
                                        <p className="text-lg font-black text-farmx-dark mb-4">{shipment.currentLocation}</p>

                                        {shipment.temperature && (
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">IoT Temp</p>
                                                    <p className="font-black text-farmx-dark">{shipment.temperature}°C</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">IoT Humidity</p>
                                                    <p className="font-black text-farmx-dark">{shipment.humidity}%</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 flex gap-4">
                                {selectedOrder.status === 'REQUESTED' && (!payment || payment.status !== 'COMPLETED') && (
                                    <button
                                        onClick={handlePayment}
                                        disabled={processingPayment}
                                        className="flex-1 py-5 bg-farmx-green text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-farmx-green-dark transition-all disabled:opacity-50"
                                    >
                                        {processingPayment ? 'Processing...' : `Pay ₹${selectedOrder.totalPrice}`}
                                    </button>
                                )}

                                {selectedOrder.status === 'SHIPPED' && (
                                    <button
                                        onClick={() => handleConfirmReceipt(selectedOrder.id)}
                                        className="flex-1 py-5 bg-farmx-dark text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-farmx-green transition-all"
                                    >
                                        Confirm Receipt & Finalize
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setShowDisputeModal(true);
                                    }}
                                    className="px-6 py-5 bg-red-50 text-red-500 border border-red-100 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-100 transition-all"
                                >
                                    Report Issue
                                </button>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all"
                                >
                                    Close Matrix View
                                </button>
                            </div>
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
                                    <option value="QUALITY_ISSUE">Quality Issue</option>
                                    <option value="PAYMENT_DISPUTE">Payment Dispute</option>
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
