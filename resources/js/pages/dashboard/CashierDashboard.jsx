import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { HiCash, HiShoppingCart, HiClock, HiPlusCircle } from "react-icons/hi";
import { formatCurrency } from "../../utils/formatters";
import orderService from "../../services/orderService";
import toast from "react-hot-toast";

const CashierDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        todaySales: 0,
        todayOrders: 0,
        pendingOrders: 0,
    });
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await orderService.getAll({
                status: "pending,preparing,ready",
                per_page: 100,
            });

            // Handle paginated response from Laravel
            const orders = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];

            setActiveOrders(orders);

            // Calculate stats
            const today = new Date().toISOString().split("T")[0];
            const todayOrders = orders.filter(
                (order) =>
                    order.created_at && order.created_at.startsWith(today),
            );

            const todaySales = todayOrders.reduce(
                (sum, order) => sum + parseFloat(order.total_amount || 0),
                0,
            );

            setStats({
                todaySales,
                todayOrders: todayOrders.length,
                pendingOrders: orders.filter((o) => o.status === "pending")
                    .length,
            });
        } catch (error) {
            console.error("Failed to load orders:", error);
            toast.error(
                error.response?.data?.message || "Failed to load orders",
            );
            setActiveOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusVariant = (status) => {
        const variants = {
            ready: "success",
            preparing: "primary",
            pending: "warning",
            completed: "success",
            cancelled: "danger",
        };
        return variants[status] || "default";
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Cashier Dashboard
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage orders and payments
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => navigate("/pos")}
                    className="gap-2"
                >
                    <HiPlusCircle className="h-5 w-5" />
                    New Order
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatsCard
                    title="Today's Sales"
                    value={formatCurrency(stats.todaySales)}
                    icon={HiCash}
                    color="success"
                />
                <StatsCard
                    title="Today's Orders"
                    value={stats.todayOrders}
                    icon={HiShoppingCart}
                    color="primary"
                />
                <StatsCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={HiClock}
                    color="warning"
                />
            </div>

            {/* Active Orders */}
            <Card title="Active Orders" subtitle="Orders in progress">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading orders...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activeOrders.length > 0 ? (
                            activeOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <p className="font-semibold text-gray-900">
                                                    #
                                                    {order.order_number ||
                                                        order.id}
                                                </p>
                                                <Badge
                                                    variant={getStatusVariant(
                                                        order.status,
                                                    )}
                                                >
                                                    {order.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {order.customer_name ||
                                                    order.table?.table_number ||
                                                    `Table ${order.table_id}` ||
                                                    "Walk-in Customer"}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {formatCurrency(
                                                    order.total_amount || 0,
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleString("id-ID", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    day: "2-digit",
                                                    month: "short",
                                                })}
                                            </p>
                                        </div>
                                        <Link to={`/orders/${order.id}`}>
                                            <Button size="sm" variant="outline">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <HiShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                                <p className="font-medium">No active orders</p>
                                <p className="text-sm mt-1">
                                    Start a new order from POS
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate("/pos")}
                                    className="mt-4 gap-2"
                                >
                                    <HiPlusCircle className="h-5 w-5" />
                                    Create New Order
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default CashierDashboard;
