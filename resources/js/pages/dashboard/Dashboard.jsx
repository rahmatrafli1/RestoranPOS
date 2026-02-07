import React from "react";
import { useAuth } from "../../hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import CashierDashboard from "./CashierDashboard";
import WaiterDashboard from "./WaiterDashboard";
import ChefDashboard from "./ChefDashboard";

const Dashboard = () => {
    const { user } = useAuth();

    // Render dashboard based on user role
    switch (user?.role) {
        case "admin":
            return <AdminDashboard />;
        case "cashier":
            return <CashierDashboard />;
        case "waiter":
            return <WaiterDashboard />;
        case "chef":
            return <ChefDashboard />;
        default:
            return (
                <div className="text-center py-12">
                    <p className="text-gray-500">Invalid user role</p>
                </div>
            );
    }
};

export default Dashboard;
