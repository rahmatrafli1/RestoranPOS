// filepath: resources/js/services/authService.js

import api from "./api";

const authService = {
    // Helper functions for local storage
    getStoredToken: () => {
        return localStorage.getItem("token");
    },

    getStoredUser: () => {
        try {
            const user = localStorage.getItem("user");
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error parsing stored user:", error);
            return null;
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem("token");
        return !!token;
    },

    setStoredUser: (user) => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    },

    setStoredToken: (token) => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    },

    // API Methods
    login: async (credentials) => {
        const response = await api.post("/login", credentials);

        // Save to localStorage
        if (response.data?.token) {
            authService.setStoredToken(response.data.token);
        }
        if (response.data?.user) {
            authService.setStoredUser(response.data.user);
        }

        return response;
    },

    logout: async () => {
        try {
            await api.post("/logout");
        } finally {
            // Always clear localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    },

    me: async () => {
        const response = await api.get("/me");

        // Update stored user
        const user =
            response.data?.data || response.data?.user || response.data;
        if (user) {
            authService.setStoredUser(user);
        }

        return response;
    },

    updateProfile: (data) => api.put("/profile", data),

    changePassword: (data) => api.put("/change-password", data),

    // Clear all auth data
    clearAuth: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};

export default authService;
