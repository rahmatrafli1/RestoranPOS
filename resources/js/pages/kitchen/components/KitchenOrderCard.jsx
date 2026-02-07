import React, { useState, useEffect } from "react";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import { formatDateTime } from "../../../utils/formatters";
import { HiClock, HiFire, HiCheckCircle } from "react-icons/hi";

const KitchenOrderCard = ({ order, onUpdateStatus, status }) => {
    const [elapsedTime, setElapsedTime] = useState("");

    useEffect(() => {
        const updateElapsedTime = () => {
            const created = new Date(order.created_at);
            const now = new Date();
            const diffMs = now - created;
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins < 1) {
                setElapsedTime("Just now");
            } else if (diffMins < 60) {
                setElapsedTime(`${diffMins} min${diffMins > 1 ? "s" : ""} ago`);
            } else {
                const diffHours = Math.floor(diffMins / 60);
                setElapsedTime(
                    `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`,
                );
            }
        };

        updateElapsedTime();
        const interval = setInterval(updateElapsedTime, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [order.created_at]);

    const getPriorityColor = () => {
        const created = new Date(order.created_at);
        const now = new Date();
        const diffMins = Math.floor((now - created) / 60000);

        if (diffMins > 30) return "bg-danger-100 border-danger-300";
        if (diffMins > 15) return "bg-warning-100 border-warning-300";
        return "bg-white border-gray-200";
    };

    const getActionButton = () => {
        switch (status) {
            case "pending":
                return (
                    <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => onUpdateStatus(order.id, "preparing")}
                        className="gap-2"
                    >
                        <HiFire className="h-4 w-4" />
                        Start Preparing
                    </Button>
                );
            case "preparing":
                return (
                    <Button
                        variant="success"
                        size="sm"
                        fullWidth
                        onClick={() => onUpdateStatus(order.id, "ready")}
                        className="gap-2"
                    >
                        <HiCheckCircle className="h-4 w-4" />
                        Mark as Ready
                    </Button>
                );
            case "ready":
                return (
                    <Button
                        variant="success"
                        size="sm"
                        fullWidth
                        onClick={() => onUpdateStatus(order.id, "completed")}
                        className="gap-2"
                    >
                        <HiCheckCircle className="h-4 w-4" />
                        Complete
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <Card
            className={`${getPriorityColor()} border-2 hover:shadow-lg transition-shadow`}
        >
            <div className="space-y-3">
                {/* Order Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                            #{order.order_number}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {order.table?.table_number
                                ? `Table ${order.table.table_number}`
                                : order.customer_name || "Takeaway"}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                        <HiClock className="h-4 w-4" />
                        <span className="text-xs font-medium">
                            {elapsedTime}
                        </span>
                    </div>
                </div>

                {/* Order Type */}
                <Badge
                    variant={
                        order.order_type === "dine_in" ? "primary" : "secondary"
                    }
                    size="sm"
                >
                    {order.order_type === "dine_in"
                        ? "Dine In"
                        : order.order_type === "takeaway"
                          ? "Takeaway"
                          : "Delivery"}
                </Badge>

                {/* Order Items */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {order.items?.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-2 rounded border border-gray-200"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm">
                                        {item.quantity}x {item.menu_item?.name}
                                    </p>
                                    {item.notes && (
                                        <p className="text-xs text-danger-600 italic mt-1 bg-danger-50 px-2 py-1 rounded">
                                            ⚠️ {item.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <div className="pt-3 border-t border-gray-200">
                    {getActionButton()}
                </div>

                {/* Footer */}
                <div className="text-xs text-gray-500 text-center">
                    {formatDateTime(order.created_at)}
                </div>
            </div>
        </Card>
    );
};

export default KitchenOrderCard;
