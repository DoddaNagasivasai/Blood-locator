import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Reusing dashboard styles for card layout

const API_URL = "http://localhost:5000/api";

export default function BloodStockPublic() {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        try {
            const response = await fetch(`${API_URL}/blood-stock`);
            if (!response.ok) {
                throw new Error("Failed to fetch stock data");
            }
            const data = await response.json();
            setStock(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header" style={{ backgroundColor: '#e74c3c' }}>
                <div className="container">
                    <h1>🩸 Blood Stock Availability</h1>
                    <p className="dashboard-subtitle">Real-time status of available blood units.</p>
                </div>
            </div>

            <div className="container dashboard-content">
                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                    <p>Loading stock data...</p>
                ) : (
                    <div className="card">
                        <h3>Current Stock Levels</h3>
                        {stock.length === 0 ? (
                            <p>No stock data available.</p>
                        ) : (
                            <div className="grid-summary">
                                {stock.map(item => (
                                    <div key={item.id} className="stat-box">
                                        {item.bloodGroup} <span>{item.quantity} units</span>
                                        <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '5px' }}>
                                            Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
