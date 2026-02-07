import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { HiFire, HiClock, HiCheckCircle } from "react-icons/hi";
import orderService from "../../services/orderService";
import toast from "react-hot-toast";

const ChefDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        preparing: 0,
        pending: 0,
        completed: 0,
    });
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
        // Auto refresh every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderService.getKitchenOrders();
            const ordersData = response.data || [];
            setOrders(ordersData);

            setStats({
                preparing: ordersData.filter((o) => o.status === "preparing")
                    .length,
                pending: ordersData.filter((o) => o.status === "pending")
                    .length,
                completed: ordersData.filter((o) => o.status === "ready")
                    .length,
            });
        } catch (error) {
            toast.error("Failed to load orders");
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Kitchen Dashboard
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage cooking orders
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate("/kitchen")}>
                    Kitchen Display
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatsCard
                    title="Preparing"
                    value={stats.preparing}
                    icon={HiFire}
                    color="primary"
                />
                <StatsCard
                    title="Pending"
                    value={stats.pending}
                    icon={HiClock}
                    color="warning"
                />
                <StatsCard
                    title="Ready"
                    value={stats.completed}
                    icon={HiCheckCircle}
                    color="success"
                />
            </div>

            {/* Orders List */}
            <Card title="Current Orders">
                <div className="space-y-3">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div
                                key={order.id}
                                className="p-4 border border-gray-200 rounded-lg"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Order #{order.order_number}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.table?.table_number ||
                                                order.customer_name}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            order.status === "ready"
                                                ? "success"
                                                : order.status === "preparing"
                                                  ? "primary"
                                                  : "warning"
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    {order.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="text-gray-700">
                                                {item.quantity}x{" "}
                                                {item.menu_item.name}
                                            </span>
                                            {item.notes && (
                                                <span className="text-gray-500 italic">
                                                    {item.notes}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <HiFire className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <p>No orders to prepare</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ChefDashboard;
