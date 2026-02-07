import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

// Placeholder components (will be created in next parts)
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
                                    <Route
                                        path="/dashboard"
                                        element={<Dashboard />}
                                    />

                                    {/* Placeholders for future routes */}
                                    <Route path="/pos" element={<NotFound />} />
                                    <Route
                                        path="/orders"
                                        element={<NotFound />}
                                    />
                                    <Route
                                        path="/kitchen"
                                        element={<NotFound />}
                                    />
                                    <Route
                                        path="/menu"
                                        element={<NotFound />}
                                    />
                                    <Route
                                        path="/categories"
                                        element={<NotFound />}
                                    />
                                    <Route
                                        path="/tables"
                                        element={<NotFound />}
                                    />
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
