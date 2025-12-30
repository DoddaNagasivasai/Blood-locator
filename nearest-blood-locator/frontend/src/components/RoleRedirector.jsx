import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRedirector() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            const role = user.role || 'donor';
            if (role === 'bank') {
                navigate('/bloodbank-dashboard');
            } else if (role === 'recipient') {
                navigate('/recipient-dashboard');
            } else {
                navigate('/donor-dashboard');
            }
        } else if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
            <p>Redirecting to your dashboard...</p>
        </div>
    );
}
