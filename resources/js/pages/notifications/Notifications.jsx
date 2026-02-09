import React from "react";
import { useNotifications } from "../../contexts/NotificationContext";
import {
    HiBell,
    HiCheck,
    HiTrash,
    HiCheckCircle,
    HiRefresh,
} from "react-icons/hi";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        refetch,
    } = useNotifications();

    const handleRefresh = async () => {
        if (refetch) {
            await refetch();
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "order":
                return "🛒";
            case "payment":
                return "💰";
            case "alert":
                return "⚠️";
            case "stock":
                return "📦";
            default:
                return "🔔";
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case "order":
                return "bg-blue-100 border-blue-500";
            case "payment":
                return "bg-green-100 border-green-500";
            case "alert":
                return "bg-yellow-100 border-yellow-500";
            case "stock":
                return "bg-orange-100 border-orange-500";
            default:
                return "bg-gray-100 border-gray-500";
        }
    };

    const formatTime = (timestamp) => {
        try {
            return formatDistanceToNow(new Date(timestamp), {
                addSuffix: true,
            });
        } catch (error) {
            return timestamp;
        }
    };

    if (loading && notifications.length === 0) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            Loading notifications...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
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
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            icon={HiRefresh}
                            disabled={loading}
                        >
                            Refresh
                        </Button>
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
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <HiBell className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            No notifications
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
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
                            className={`
                                transition-all duration-200 hover:shadow-md
                                ${
                                    !notification.is_read
                                        ? `border-l-4 ${getNotificationColor(notification.type)}`
                                        : "border-l-4 border-gray-200"
                                }
                            `}
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 text-3xl mt-1">
                                    {getNotificationIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3
                                                className={`text-sm font-semibold ${
                                                    !notification.is_read
                                                        ? "text-gray-900"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {notification.title}
                                                {!notification.is_read && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                                                        New
                                                    </span>
                                                )}
                                            </h3>
                                            <p
                                                className={`text-sm mt-1 ${
                                                    !notification.is_read
                                                        ? "text-gray-800"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {notification.message}
                                            </p>

                                            {/* Additional Data */}
                                            {notification.data && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {notification.data
                                                        .order_number && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                                                            Order:{" "}
                                                            {
                                                                notification
                                                                    .data
                                                                    .order_number
                                                            }
                                                        </span>
                                                    )}
                                                    {notification.data
                                                        .table_number && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                                                            Table:{" "}
                                                            {
                                                                notification
                                                                    .data
                                                                    .table_number
                                                            }
                                                        </span>
                                                    )}
                                                    {notification.data
                                                        .amount && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                                            Rp{" "}
                                                            {Number(
                                                                notification
                                                                    .data
                                                                    .amount,
                                                            ).toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-500 mt-2">
                                                {formatTime(
                                                    notification.created_at,
                                                )}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 flex-shrink-0">
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id,
                                                        )
                                                    }
                                                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <HiCheck className="h-5 w-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    deleteNotification(
                                                        notification.id,
                                                    )
                                                }
                                                className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <HiTrash className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
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
