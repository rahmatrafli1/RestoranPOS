import api from "./api";

const notificationService = {
    // Get all notifications
    getAll: async (page = 1) => {
        const response = await api.get(`/notifications?page=${page}`);
        return response.data;
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await api.get("/notifications/unread-count");
        return response.data;
    },

    // Mark as read
    markAsRead: async (id) => {
        const response = await api.post(`/notifications/${id}/mark-as-read`);
        return response.data;
    },

    // Mark all as read
    markAllAsRead: async () => {
        const response = await api.post("/notifications/mark-all-as-read");
        return response.data;
    },

    // Delete notification
    delete: async (id) => {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    },

    // Clear all notifications
    clearAll: async () => {
        const response = await api.delete("/notifications");
        return response.data;
    },
};

export default notificationService;
