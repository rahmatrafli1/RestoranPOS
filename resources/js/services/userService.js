import api from './api';

const userService = {
  /**
   * Get all users
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getAll: (params = {}) => {
    return api.get('/users', { params });
  },

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise}
   */
  getById: (id) => {
    return api.get(`/users/${id}`);
  },

  /**
   * Create new user
   * @param {Object} data - User data
   * @returns {Promise}
   */
  create: (data) => {
    return api.post('/users', data);
  },

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} data - User data
   * @returns {Promise}
   */
  update: (id, data) => {
    return api.put(`/users/${id}`, data);
  },

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise}
   */
  delete: (id) => {
    return api.delete(`/users/${id}`);
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data
   * @returns {Promise}
   */
  updateProfile: (data) => {
    return api.put('/profile', data);
  },

  /**
   * Change password
   * @param {Object} data - Password data
   * @returns {Promise}
   */
  changePassword: (data) => {
    return api.put('/profile/password', data);
  },

  /**
   * Update user status
   * @param {number} id - User ID
   * @param {boolean} isActive - Active status
   * @returns {Promise}
   */
  updateStatus: (id, isActive) => {
    return api.put(`/users/${id}/status`, { is_active: isActive });
  },

  /**
   * Get user statistics
   * @returns {Promise}
   */
  getStatistics: () => {
    return api.get('/users/statistics');
  },

  /**
   * Get users by role
   * @param {string} role - User role (admin, cashier, waiter, chef)
   * @returns {Promise}
   */
  getByRole: (role) => {
    return api.get('/users', { params: { role } });
  },

  /**
   * Check if username exists
   * @param {string} username - Username to check
   * @returns {Promise}
   */
  checkUsername: (username) => {
    return api.get('/users/check-username', { params: { username } });
  },

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise}
   */
  checkEmail: (email) => {
    return api.get('/users/check-email', { params: { email } });
  },

  /**
   * Get active users
   * @returns {Promise}
   */
  getActiveUsers: () => {
    return api.get('/users', { params: { is_active: true } });
  },

  /**
   * Get inactive users
   * @returns {Promise}
   */
  getInactiveUsers: () => {
    return api.get('/users', { params: { is_active: false } });
  },

  /**
   * Bulk update users
   * @param {Array} ids - Array of user IDs
   * @param {Object} data - Data to update
   * @returns {Promise}
   */
  bulkUpdate: (ids, data) => {
    return api.put('/users/bulk-update', { ids, ...data });
  },

  /**
   * Bulk delete users
   * @param {Array} ids - Array of user IDs
   * @returns {Promise}
   */
  bulkDelete: (ids) => {
    return api.post('/users/bulk-delete', { ids });
  },

  /**
   * Reset user password
   * @param {number} id - User ID
   * @param {string} newPassword - New password
   * @returns {Promise}
   */
  resetPassword: (id, newPassword) => {
    return api.put(`/users/${id}/reset-password`, { password: newPassword });
  },

  /**
   * Upload user avatar
   * @param {number} id - User ID
   * @param {File} file - Avatar file
   * @returns {Promise}
   */
  uploadAvatar: (id, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete user avatar
   * @param {number} id - User ID
   * @returns {Promise}
   */
  deleteAvatar: (id) => {
    return api.delete(`/users/${id}/avatar`);
  },

  /**
   * Get user activity log
   * @param {number} id - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getActivityLog: (id, params = {}) => {
    return api.get(`/users/${id}/activity`, { params });
  },

  /**
   * Get user permissions
   * @param {number} id - User ID
   * @returns {Promise}
   */
  getPermissions: (id) => {
    return api.get(`/users/${id}/permissions`);
  },

  /**
   * Update user permissions
   * @param {number} id - User ID
   * @param {Array} permissions - Array of permission IDs
   * @returns {Promise}
   */
  updatePermissions: (id, permissions) => {
    return api.put(`/users/${id}/permissions`, { permissions });
  },

  /**
   * Get current user
   * @returns {Promise}
   */
  getCurrentUser: () => {
    return api.get('/user');
  },

  /**
   * Update current user profile
   * @param {Object} data - Profile data
   * @returns {Promise}
   */
  updateCurrentProfile: (data) => {
    return api.put('/user/profile', data);
  },

  /**
   * Export users to CSV
   * @param {Object} params - Filter parameters
   * @returns {Promise}
   */
  exportToCSV: (params = {}) => {
    return api.get('/users/export', {
      params,
      responseType: 'blob',
    });
  },

  /**
   * Export users to Excel
   * @param {Object} params - Filter parameters
   * @returns {Promise}
   */
  exportToExcel: (params = {}) => {
    return api.get('/users/export/excel', {
      params,
      responseType: 'blob',
    });
  },

  /**
   * Import users from CSV
   * @param {File} file - CSV file
   * @returns {Promise}
   */
  importFromCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get user roles
   * @returns {Promise}
   */
  getRoles: () => {
    return api.get('/users/roles');
  },

  /**
   * Search users
   * @param {string} query - Search query
   * @returns {Promise}
   */
  search: (query) => {
    return api.get('/users/search', { params: { q: query } });
  },

  /**
   * Get users with pagination
   * @param {number} page - Page number
   * @param {number} perPage - Items per page
   * @param {Object} filters - Filter parameters
   * @returns {Promise}
   */
  getPaginated: (page = 1, perPage = 10, filters = {}) => {
    return api.get('/users', {
      params: {
        page,
        per_page: perPage,
        ...filters,
      },
    });
  },

  /**
   * Activate user
   * @param {number} id - User ID
   * @returns {Promise}
   */
  activate: (id) => {
    return api.put(`/users/${id}/activate`);
  },

  /**
   * Deactivate user
   * @param {number} id - User ID
   * @returns {Promise}
   */
  deactivate: (id) => {
    return api.put(`/users/${id}/deactivate`);
  },

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise}
   */
  sendPasswordResetEmail: (email) => {
    return api.post('/users/password-reset', { email });
  },

  /**
   * Verify email
   * @param {string} token - Verification token
   * @returns {Promise}
   */
  verifyEmail: (token) => {
    return api.post('/users/verify-email', { token });
  },

  /**
   * Get user sessions
   * @param {number} id - User ID
   * @returns {Promise}
   */
  getSessions: (id) => {
    return api.get(`/users/${id}/sessions`);
  },

  /**
   * Revoke user session
   * @param {number} id - User ID
   * @param {string} sessionId - Session ID
   * @returns {Promise}
   */
  revokeSession: (id, sessionId) => {
    return api.delete(`/users/${id}/sessions/${sessionId}`);
  },

  /**
   * Get user login history
   * @param {number} id - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getLoginHistory: (id, params = {}) => {
    return api.get(`/users/${id}/login-history`, { params });
  },
};

export default userService;