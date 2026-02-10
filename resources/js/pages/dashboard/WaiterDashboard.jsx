import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../components/dashboard/StatsCard";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import {
    HiClipboardList,
    HiViewGrid,
    HiClock,
    HiPlusCircle,
} from "react-icons/hi";
import tableService from "../../services/tableService";
import orderService from "../../services/orderService";
import toast from "react-hot-toast";

const WaiterDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        myOrders: 0,
        occupiedTables: 0,
        pendingOrders: 0,
    });
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tablesRes, ordersRes] = await Promise.all([
                tableService.getAll(),
                orderService.getAll({ status: "pending,preparing" }),
            ]);

            // Handle different response structures for tables
            let tablesData = [];
            if (tablesRes.data) {
                if (Array.isArray(tablesRes.data)) {
                    tablesData = tablesRes.data;
                } else if (
                    tablesRes.data.data &&
                    Array.isArray(tablesRes.data.data)
                ) {
                    tablesData = tablesRes.data.data;
                } else if (
                    tablesRes.data.tables &&
                    Array.isArray(tablesRes.data.tables)
                ) {
                    tablesData = tablesRes.data.tables;
                }
            }

            // Handle different response structures for orders
            let ordersData = [];
            if (ordersRes.data) {
                if (Array.isArray(ordersRes.data)) {
                    ordersData = ordersRes.data;
                } else if (
                    ordersRes.data.data &&
                    Array.isArray(ordersRes.data.data)
                ) {
                    ordersData = ordersRes.data.data;
                } else if (
                    ordersRes.data.orders &&
                    Array.isArray(ordersRes.data.orders)
                ) {
                    ordersData = ordersRes.data.orders;
                }
            }

            setTables(tablesData);

            const pendingCount = ordersData.filter(
                (o) => o.status === "pending",
            ).length;
            const occupiedCount = tablesData.filter(
                (t) => t.status === "occupied",
            ).length;

            setStats({
                myOrders: ordersData.length,
                occupiedTables: occupiedCount,
                pendingOrders: pendingCount,
            });
        } catch (error) {
            console.error("=== Dashboard Fetch Error ===");
            console.error("Error:", error);
            console.error("Error Response:", error.response?.data);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const getTableColor = (status) => {
        switch (status) {
            case "available":
                return "bg-success-100 border-success-300 text-success-800";
            case "occupied":
                return "bg-danger-100 border-danger-300 text-danger-800";
            case "reserved":
                return "bg-warning-100 border-warning-300 text-warning-800";
            default:
                return "bg-gray-100 border-gray-300 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Waiter Dashboard
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage tables and orders
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
                    title="My Orders"
                    value={stats.myOrders}
                    icon={HiClipboardList}
                    color="primary"
                />
                <StatsCard
                    title="Occupied Tables"
                    value={stats.occupiedTables}
                    icon={HiViewGrid}
                    color="danger"
                />
                <StatsCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={HiClock}
                    color="warning"
                />
            </div>

            {/* Tables Grid */}
            <Card title="Tables Overview">
                {tables.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {tables.map((table) => (
                            <button
                                key={table.id}
                                onClick={() => navigate(`/tables/${table.id}`)}
                                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${getTableColor(
                                    table.status,
                                )}`}
                            >
                                <p className="text-sm font-medium mb-1">
                                    {table.table_number}
                                </p>
                                <p className="text-xs capitalize">
                                    {table.status}
                                </p>
                                <p className="text-xs mt-1">
                                    {table.capacity} seats
                                </p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <HiViewGrid className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No tables available</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default WaiterDashboard;
