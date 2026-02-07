import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loading from "../common/Loading";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, loading, hasRole } = useAuth();

    if (loading) {
        return <Loading fullScreen text="Checking authentication..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        403
                    </h1>
                    <p className="text-gray-600 mb-6">Access Denied</p>
                    <p className="text-sm text-gray-500">
                        You don't have permission to access this page.
                    </p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
