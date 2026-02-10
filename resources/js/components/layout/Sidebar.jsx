import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
    HiHome,
    HiViewGrid,
    HiShoppingCart,
    HiClipboardList,
    HiUsers,
    HiCog,
    HiChartBar,
    HiCollection,
    HiCube,
    HiFire,
} from "react-icons/hi";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, hasRole } = useAuth();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: HiHome,
            roles: ["admin", "cashier", "waiter", "chef"],
        },
        {
            name: "POS",
            path: "/pos",
            icon: HiShoppingCart,
            roles: ["cashier", "waiter"],
        },
        {
            name: "Orders",
            path: "/orders",
            icon: HiClipboardList,
            roles: ["admin", "cashier", "waiter"],
        },
        {
            name: "Kitchen Display",
            path: "/kitchen",
            icon: HiFire,
            roles: ["chef", "admin"],
        },
        {
            name: "Menu Items",
            path: "/menu",
            icon: HiCube,
            roles: ["admin"],
        },
        {
            name: "Categories",
            path: "/categories",
            icon: HiCollection,
            roles: ["admin"],
        },
        {
            name: "Tables",
            path: "/tables",
            icon: HiViewGrid,
            roles: ["admin", "waiter"],
        },
        {
            name: "Reports",
            path: "/reports",
            icon: HiChartBar,
            roles: ["admin"],
        },
        {
            name: "Users",
            path: "/users",
            icon: HiUsers,
            roles: ["admin"],
        },
        {
            name: "Settings",
            path: "/settings",
            icon: HiCog,
            roles: ["admin", "cashier", "waiter", "chef"],
        },
    ];

    const filteredMenuItems = menuItems.filter((item) => hasRole(item.roles));

    return (
        <>
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-16 left-0 bottom-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 lg:static lg:top-0 lg:h-screen`}
            >
                <div className="flex flex-col h-full">
                    {/* User info - Mobile only */}
                    <div className="p-4 border-b border-gray-200 lg:hidden flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.full_name}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {user?.role}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-1">
                            {filteredMenuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                            isActive
                                                ? "bg-primary-50 text-primary-700"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`
                                    }
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <span>{item.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 flex-shrink-0">
                        <div className="text-xs text-gray-500 text-center">
                            <p className="font-medium">RestoranPOS v1.0</p>
                            <p className="mt-1">
                                © {new Date().getFullYear()} All rights reserved
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
