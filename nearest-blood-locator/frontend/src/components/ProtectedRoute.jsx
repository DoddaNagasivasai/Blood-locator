import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role check logic
    if (allowedRoles && allowedRoles.length > 0) {
        // If user has a role, check it. If user has no 'role' field (legacy), default to 'donor' or deny?
        // Assuming backend now sends 'role'.
        const userRole = user.role || 'donor';

        if (!allowedRoles.includes(userRole)) {
            // Redirect to their appropriate dashboard if they try to access a wrong one
            if (userRole === 'bank') return <Navigate to="/bloodbank-dashboard" replace />;
            if (userRole === 'recipient') return <Navigate to="/recipient-dashboard" replace />;
            return <Navigate to="/donor-dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
