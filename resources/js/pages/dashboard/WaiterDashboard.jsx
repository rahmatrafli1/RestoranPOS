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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tablesRes, ordersRes] = await Promise.all([
                tableService.getAll(),
                orderService.getAll({ status: "pending,preparing" }),
            ]);

            setTables(tablesRes.data || []);
            const orders = ordersRes.data || [];

            setStats({
                myOrders: orders.length,
                occupiedTables: (tablesRes.data || []).filter(
                    (t) => t.status === "occupied",
                ).length,
                pendingOrders: orders.filter((o) => o.status === "pending")
                    .length,
            });
        } catch (error) {
            toast.error("Failed to load data");
            console.error(error);
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
                            <p className="text-xs capitalize">{table.status}</p>
                            <p className="text-xs mt-1">
                                {table.capacity} seats
                            </p>
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default WaiterDashboard;
