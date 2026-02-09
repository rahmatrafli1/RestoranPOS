import React from "react";
import { useNotifications } from "../../contexts/NotificationContext";
import { HiBell, HiCheck, HiTrash, HiCheckCircle } from "react-icons/hi";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const Notifications = () => {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
    } = useNotifications();

    const getNotificationIcon = (type) => {
        switch (type) {
            case "order":
                return "🛒";
            case "alert":
                return "⚠️";
            case "stock":
                return "📦";
            default:
                return "🔔";
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Notifications
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        You have {unreadCount} unread notification
                        {unreadCount !== 1 ? "s" : ""}
                    </p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllAsRead}
                            icon={HiCheckCircle}
                        >
                            Mark all as read
                        </Button>
                    )}
                    {notifications.length > 0 && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={clearAll}
                            icon={HiTrash}
                        >
                            Clear all
                        </Button>
                    )}
                </div>
            </div>

            {notifications.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <HiBell className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No notifications
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            You're all caught up! Check back later for new
                            notifications.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`${notification.unread ? "border-l-4 border-primary-500 bg-primary-50" : ""}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-2xl">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={`text-sm ${notification.unread ? "font-semibold text-gray-900" : "text-gray-700"}`}
                                    >
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {notification.time}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {notification.unread && (
                                        <button
                                            onClick={() =>
                                                markAsRead(notification.id)
                                            }
                                            className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                                            title="Mark as read"
                                        >
                                            <HiCheck className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            deleteNotification(notification.id)
                                        }
                                        className="p-2 text-danger-600 hover:bg-danger-100 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <HiTrash className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
