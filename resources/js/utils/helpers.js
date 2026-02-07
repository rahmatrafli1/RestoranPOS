import { STATUS_COLORS, STATUS_LABELS } from "./constants";

/**
 * Get status color class
 */
export const getStatusColor = (status) => {
    return STATUS_COLORS[status] || "secondary";
};

/**
 * Get status label
 */
export const getStatusLabel = (status) => {
    return STATUS_LABELS[status] || status;
};

/**
 * Calculate tax (10%)
 */
export const calculateTax = (amount) => {
    return amount * 0.1;
};

/**
 * Calculate total with tax
 */
export const calculateTotal = (subtotal, tax = 0, discount = 0) => {
    return subtotal + tax - discount;
};

/**
 * Generate order number
 */
export const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");

    return `ORD-${year}${month}${day}-${random}`;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Check if user has role
 */
export const hasRole = (user, roles) => {
    if (!user || !user.role) return false;

    if (Array.isArray(roles)) {
        return roles.includes(user.role);
    }

    return user.role === roles;
};

/**
 * Get image URL
 */
export const getImageUrl = (path) => {
    if (!path) return "/images/placeholder.png";

    if (path.startsWith("http")) {
        return path;
    }

    return `/storage/${path}`;
};
