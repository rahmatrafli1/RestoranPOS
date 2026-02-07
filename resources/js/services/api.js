// filepath: resources/js/services/api.js

import axios from 'axios';

// Base URL untuk API (relatif karena di project yang sama)
const BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      
      if (status === 403) {
        console.error('Access denied:', data.message);
      }
      
      return Promise.reject(data);
    } else if (error.request) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
      });
    } else {
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;