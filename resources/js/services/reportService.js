// filepath: resources/js/services/reportService.js

import api from "./api";

const reportService = {
    // Get dashboard statistics
    getDashboard: async () => {
        const response = await api.get("/reports/dashboard");
        return response.data;
    },

    // Get daily sales report
    getDailySales: async (params = {}) => {
        const response = await api.get("/reports/daily-sales", { params });
        return response.data;
    },

    // Get sales summary report
    getSalesSummary: async (params = {}) => {
        const response = await api.get("/reports/sales-summary", { params });
        return response.data;
    },

    // Get sales report (comprehensive)
    getSalesReport: async (params = {}) => {
        try {
            const response = await api.get("/reports/sales-summary", {
                params,
            });
            return response.data;
        } catch (error) {
            console.error("Get sales report error:", error.response?.data);
            throw error;
        }
    },

    // Get popular items
    getPopularItems: async (params = {}) => {
        const response = await api.get("/reports/popular-items", { params });
        return response.data;
    },

    // Get sales by category
    getSalesByCategory: async (params = {}) => {
        const response = await api.get("/reports/sales-by-category", {
            params,
        });
        return response.data;
    },

    // Get payment methods statistics
    getPaymentMethods: async (params = {}) => {
        const response = await api.get("/reports/payment-methods", { params });
        return response.data;
    },

    // Export sales report
    exportSalesReport: async (params = {}) => {
        try {
            const response = await api.get("/reports/sales-summary", {
                params: { ...params, export: true },
                responseType: "blob",
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `sales-report-${new Date().toISOString().split("T")[0]}.xlsx`,
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return response.data;
        } catch (error) {
            console.error("Export sales report error:", error.response?.data);
            throw error;
        }
    },
};

export default reportService;
