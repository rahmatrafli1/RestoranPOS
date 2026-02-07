// filepath: resources/js/services/tableService.js

import api from './api';

const tableService = {
  getAll: async (params = {}) => {
    const response = await api.get('/tables', { params });
    return response.data;
  },

  getAvailable: async () => {
    const response = await api.get('/tables/available');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tables/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/tables', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/tables/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
  },
};

export default tableService;