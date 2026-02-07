// filepath: resources/js/services/reportService.js

import api from './api';

const reportService = {
  getDashboard: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },

  getDailySales: async (date) => {
    const response = await api.get('/reports/daily-sales', {
      params: { date },
    });
    return response.data;
  },

  getSalesSummary: async (startDate, endDate) => {
    const response = await api.get('/reports/sales-summary', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  getPopularItems: async (limit = 10) => {
    const response = await api.get('/reports/popular-items', {
      params: { limit },
    });
    return response.data;
  },

  getSalesByCategory: async (startDate, endDate) => {
    const response = await api.get('/reports/sales-by-category', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  getPaymentMethods: async (startDate, endDate) => {
    const response = await api.get('/reports/payment-methods', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
};

export default reportService;