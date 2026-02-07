// filepath: resources/js/services/orderService.js

import api from './api';

const orderService = {
  getAll: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  addDiscount: async (id, discount) => {
    const response = await api.post(`/orders/${id}/discount`, { discount });
    return response.data;
  },

  getKitchenOrders: async () => {
    const response = await api.get('/orders/kitchen/display');
    return response.data;
  },

  updateItemStatus: async (itemId, status) => {
    const response = await api.put(`/order-items/${itemId}/status`, { status });
    return response.data;
  },
};

export default orderService;