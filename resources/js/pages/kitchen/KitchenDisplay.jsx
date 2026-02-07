import React, { useEffect, useState } from "react";
import { HiRefresh, HiClock, HiFire } from "react-icons/hi";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Loading from "../../components/common/Loading";
import KitchenOrderCard from "./components/KitchenOrderCard";
import orderService from "../../services/orderService";
import toast from "react-hot-toast";

const KitchenDisplay = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        fetchOrders();

        // Auto refresh every 10 seconds if enabled
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                fetchOrders();
            }, 10000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getKitchenOrders();
            setOrders(response.data || []);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await orderService.updateStatus(orderId, status);
            toast.success(`Order status updated to ${status}`);
            fetchOrders();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update status",
            );
        }
    };

    const handleRefresh = () => {
        fetchOrders();
        toast.success("Orders refreshed");
    };

    const pendingOrders = orders.filter((o) => o.status === "pending");
    const preparingOrders = orders.filter((o) => o.status === "preparing");
    const readyOrders = orders.filter((o) => o.status === "ready");

    if (loading && orders.length === 0) {
        return <Loading fullScreen text="Loading kitchen display..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Kitchen Display
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Monitor and manage cooking orders
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Auto Refresh Toggle */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="auto-refresh"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="auto-refresh"
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Auto Refresh
                        </label>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        className="gap-2"
                    >
                        <HiRefresh className="h-5 w-5" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-warning-50 border-warning-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-warning-800 mb-1">
                                Pending
                            </p>
                            <p className="text-3xl font-bold text-warning-900">
                                {pendingOrders.length}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-warning-200 rounded-full flex items-center justify-center">
                            <HiClock className="h-6 w-6 text-warning-700" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-primary-50 border-primary-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-primary-800 mb-1">
                                Preparing
                            </p>
                            <p className="text-3xl font-bold text-primary-900">
                                {preparingOrders.length}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-primary-200 rounded-full flex items-center justify-center">
                            <HiFire className="h-6 w-6 text-primary-700" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-success-50 border-success-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-success-800 mb-1">
                                Ready
                            </p>
                            <p className="text-3xl font-bold text-success-900">
                                {readyOrders.length}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-success-200 rounded-full flex items-center justify-center">
                            <svg
                                className="h-6 w-6 text-success-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Orders Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Column */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <HiClock className="h-5 w-5 text-warning-600" />
                            Pending
                        </h2>
                        <Badge variant="warning">{pendingOrders.length}</Badge>
                    </div>
                    <div className="space-y-3">
                        {pendingOrders.map((order) => (
                            <KitchenOrderCard
                                key={order.id}
                                order={order}
                                onUpdateStatus={handleUpdateStatus}
                                status="pending"
                            />
                        ))}
                        {pendingOrders.length === 0 && (
                            <Card className="bg-gray-50">
                                <p className="text-center text-gray-500 text-sm py-8">
                                    No pending orders
                                </p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Preparing Column */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <HiFire className="h-5 w-5 text-primary-600" />
                            Preparing
                        </h2>
                        <Badge variant="primary">
                            {preparingOrders.length}
                        </Badge>
                    </div>
                    <div className="space-y-3">
                        {preparingOrders.map((order) => (
                            <KitchenOrderCard
                                key={order.id}
                                order={order}
                                onUpdateStatus={handleUpdateStatus}
                                status="preparing"
                            />
                        ))}
                        {preparingOrders.length === 0 && (
                            <Card className="bg-gray-50">
                                <p className="text-center text-gray-500 text-sm py-8">
                                    No orders in preparation
                                </p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Ready Column */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <svg
                                className="h-5 w-5 text-success-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Ready
                        </h2>
                        <Badge variant="success">{readyOrders.length}</Badge>
                    </div>
                    <div className="space-y-3">
                        {readyOrders.map((order) => (
                            <KitchenOrderCard
                                key={order.id}
                                order={order}
                                onUpdateStatus={handleUpdateStatus}
                                status="ready"
                            />
                        ))}
                        {readyOrders.length === 0 && (
                            <Card className="bg-gray-50">
                                <p className="text-center text-gray-500 text-sm py-8">
                                    No ready orders
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KitchenDisplay;
