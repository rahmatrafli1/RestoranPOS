// filepath: resources/js/services/paymentService.js

import api from './api';

const paymentService = {
  processPayment: async (orderId, data) => {
    const response = await api.post(`/orders/${orderId}/payment`, data);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  getByOrderId: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/payment`);
    return response.data;
  },
};

export default paymentService;