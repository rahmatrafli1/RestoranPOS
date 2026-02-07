import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import CategoryList from "./pages/categories/CategoryList";
import MenuList from "./pages/menu/MenuList";
import TableList from "./pages/tables/TableList";
import POSPage from "./pages/pos/POSPage";
import OrderList from "./pages/orders/OrderList";
import OrderDetail from "./pages/orders/OrderDetail";
import KitchenDisplay from "./pages/kitchen/KitchenDisplay";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

// Placeholder components
const NotFound = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Page not found</p>
            <a
                href="/dashboard"
                className="text-primary-600 hover:text-primary-700 font-medium"
            >
                Back to Dashboard
            </a>
        </div>
    </div>
);

function App() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-gray-50">
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <Login />
                        )
                    }
                />

                {/* Protected Routes with Layout */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Routes>
                                    {/* Dashboard */}
                                    <Route
                                        path="/dashboard"
                                        element={<Dashboard />}
                                    />

                                    {/* POS - Cashier & Waiter */}
                                    <Route
                                        path="/pos"
                                        element={
                                            <ProtectedRoute
                                                allowedRoles={[
                                                    "cashier",
                                                    "waiter",
                                                ]}
                                            >
                                                <POSPage />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Orders - Admin, Cashier, Waiter */}
                                    <Route
                                        path="/orders"
                                        element={
                                            <ProtectedRoute
                                                allowedRoles={[
                                                    "admin",
                                                    "cashier",
                                                    "waiter",
                                                ]}
                                            >
                                                <OrderList />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/orders/:id"
                                        element={
                                            <ProtectedRoute
                                                allowedRoles={[
                                                    "admin",
                                                    "cashier",
                                                    "waiter",
                                                ]}
                                            >
                                                <OrderDetail />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Kitchen Display - Chef & Admin */}
                                    <Route
                                        path="/kitchen"
                                        element={
                                            <ProtectedRoute
                                                allowedRoles={["chef", "admin"]}
                                            >
                                                <KitchenDisplay />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Categories - Admin only */}
                                    <Route
                                        path="/categories"
                                        element={
                                            <ProtectedRoute
                                                allowedRoles={["admin"]}
                                            >
                                                <CategoryList />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Menu Items - Admin only */}
                                    <Route
                                        path="/menu"
                                        element={
                                            <ProtectedRoute
                                                allowedRoles={["admin"]}
                                            >
                                                <MenuList />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Tables - Admin & Waiter */}
                                    <Route
                                        path="/tables"
                                        element={
                                            <ProtectedRoute
                                                allowedRoles={[
                                                    "admin",
                                                    "waiter",
                                                ]}
                                            >
                                                <TableList />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Placeholders for future routes */}
                                    <Route
                                        path="/reports"
                                        element={<NotFound />}
                                    />
                                    <Route
                                        path="/users"
                                        element={<NotFound />}
                                    />
                                    <Route
                                        path="/settings"
                                        element={<NotFound />}
                                    />

                                    {/* Default redirect */}
                                    <Route
                                        path="/"
                                        element={<Navigate to="/dashboard" />}
                                    />

                                    {/* 404 */}
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
