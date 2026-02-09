import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from "react";
import notificationService from "../services/notificationService";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Fetch notifications dari API
    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const response = await notificationService.getAll();
            const notifData = response.data || [];
            setNotifications(Array.isArray(notifData) ? notifData : []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const response = await notificationService.getUnreadCount();
            setUnreadCount(response.count || 0);
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
            setUnreadCount(0);
        }
    }, [isAuthenticated]);

    // Mark as read
    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === id
                        ? {
                              ...notif,
                              is_read: true,
                              read_at: new Date().toISOString(),
                          }
                        : notif,
                ),
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read:", error);
            toast.error("Failed to mark as read");
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications((prev) =>
                prev.map((notif) => ({
                    ...notif,
                    is_read: true,
                    read_at: new Date().toISOString(),
                })),
            );
            setUnreadCount(0);
            toast.success("All notifications marked as read");
        } catch (error) {
            console.error("Failed to mark all as read:", error);
            toast.error("Failed to mark all as read");
        }
    };

    // Delete notification
    const deleteNotification = async (id) => {
        try {
            await notificationService.delete(id);
            const deletedNotif = notifications.find((n) => n.id === id);
            setNotifications((prev) => prev.filter((notif) => notif.id !== id));

            if (deletedNotif && !deletedNotif.is_read) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }

            toast.success("Notification deleted");
        } catch (error) {
            console.error("Failed to delete notification:", error);
            toast.error("Failed to delete notification");
        }
    };

    // Clear all
    const clearAll = async () => {
        try {
            await notificationService.clearAll();
            setNotifications([]);
            setUnreadCount(0);
            toast.success("All notifications cleared");
        } catch (error) {
            console.error("Failed to clear notifications:", error);
            toast.error("Failed to clear notifications");
        }
    };

    // Refetch
    const refetch = useCallback(async () => {
        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
    }, [fetchNotifications, fetchUnreadCount]);

    // Fetch on mount - HANYA SEKALI
    useEffect(() => {
        let interval;

        if (isAuthenticated) {
            // Initial fetch
            fetchNotifications();
            fetchUnreadCount();

            // Poll setiap 30 detik
            interval = setInterval(() => {
                fetchUnreadCount();
            }, 30000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isAuthenticated]); // HANYA depend on isAuthenticated

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                clearAll,
                refetch,
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
