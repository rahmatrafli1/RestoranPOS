import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import GuestRoute from "../components/auth/GuestRoute";

// Pages
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import CategoryList from "../pages/categories/CategoryList";
import MenuList from "../pages/menu/MenuList";
import TableList from "../pages/tables/TableList";
import POSPage from "../pages/pos/POSPage";
import OrderList from "../pages/orders/OrderList";
import OrderDetail from "../pages/orders/OrderDetail";
import KitchenDisplay from "../pages/kitchen/KitchenDisplay";
import UserList from "../pages/users/UserList";
import ReportsPage from "../pages/reports/ReportsPage";
import SettingsPage from "../pages/settings/SettingsPage";
import Notifications from "../pages/notifications/Notifications";

const AppRouter = () => {
    return (
        <Routes>
            {/* Guest Routes */}
            <Route
                path="/login"
                element={
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                }
            />

            {/* Protected Routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Navigate to="/dashboard" replace />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/menu"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <MenuList />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/categories"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CategoryList />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <OrderList />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/orders/:id"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <OrderDetail />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tables"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <TableList />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/pos"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <POSPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/kitchen"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <KitchenDisplay />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/users"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <UserList />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ReportsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <SettingsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Notifications />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* 404 Not Found */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRouter;
