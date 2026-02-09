import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Sementara disable role checking
    // if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gray-50">
    //             <div className="text-center">
    //                 <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
    //                 <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
    //             </div>
    //         </div>
    //     );
    // }

    return children;
};

export default ProtectedRoute;
