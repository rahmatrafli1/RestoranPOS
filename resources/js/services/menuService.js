// filepath: resources/js/services/menuService.js

import api from './api';

const menuService = {
  getAll: async (params = {}) => {
    const response = await api.get('/menu-items', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/menu-items/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/menu-items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.post(`/menu-items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/menu-items/${id}`);
    return response.data;
  },

  toggleAvailability: async (id) => {
    const response = await api.post(`/menu-items/${id}/toggle-availability`);
    return response.data;
  },
};

export default menuService;