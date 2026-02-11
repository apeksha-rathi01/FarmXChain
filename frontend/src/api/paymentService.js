import api from './axios';

export const paymentService = {
    processPayment: (paymentData) => {
        return api.post('/payments/pay', paymentData);
    },

    getPaymentByOrder: (orderId) => {
        return api.get(`/payments/order/${orderId}`);
    }
};
