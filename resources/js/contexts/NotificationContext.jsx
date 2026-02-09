import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            message: "New order received",
            time: "2 min ago",
            unread: true,
            type: "order",
        },
        {
            id: 2,
            message: "Table 5 needs attention",
            time: "10 min ago",
            unread: true,
            type: "alert",
        },
        {
            id: 3,
            message: "Low stock alert: Coca Cola",
            time: "1 hour ago",
            unread: false,
            type: "stock",
        },
    ]);

    const unreadCount = notifications.filter((n) => n.unread).length;

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, unread: false } : notif,
            ),
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, unread: false })),
        );
    };

    const deleteNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                clearAll,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotifications must be used within NotificationProvider",
        );
    }
    return context;
};
