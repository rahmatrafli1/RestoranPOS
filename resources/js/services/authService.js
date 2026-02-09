// filepath: resources/js/services/authService.js

import api from "./api";

const authService = {
    login: async (credentials) => {
        const response = await api.post("/login", credentials);
        if (response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: async () => {
        const response = await api.post("/logout");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return response.data;
    },

    me: async () => {
        const response = await api.get("/me");
        if (response.data) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    },

    // Helper functions for localStorage
    getStoredToken: () => {
        return localStorage.getItem("token");
    },

    getStoredUser: () => {
        const userStr = localStorage.getItem("user");
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error("Failed to parse stored user:", error);
            return null;
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        return !!(token && user);
    },

    clearStorage: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};

export default authService;
