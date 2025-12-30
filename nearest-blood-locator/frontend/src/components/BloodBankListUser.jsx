import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './BloodBankList.css'; // Reusing existing list styles

const API_URL = "http://localhost:5000/api";

export default function BloodBankListUser() {
    const { user } = useAuth();
    const [bloodBanks, setBloodBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMyBloodBanks();
    }, []);

    const loadMyBloodBanks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/bloodbanks/my`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch your blood banks");
            }
            const data = await response.json();
            setBloodBanks(data);
        } catch (err) {
            console.error(err);
            setError("Could not load your blood banks.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bankId) => {
        if (!window.confirm('Are you sure you want to delete this blood bank?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/bloodbanks/${bankId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete blood bank");
            }

            // Remove from state
            setBloodBanks(prev => prev.filter(bank => bank.id !== bankId));
            alert('Blood bank deleted successfully');

        } catch (err) {
            console.error(err);
            alert("Error deleting blood bank: " + err.message);
        }
    };

    if (loading) return <div>Loading your blood banks...</div>;
    if (error) return <div className="error-message">{error}</div>;

    if (bloodBanks.length === 0) {
        return (
            <div className="empty-state">
                <p>You haven't registered any blood banks yet.</p>
            </div>
        );
    }

    return (
        <div className="blood-bank-list-user">
            <h3>My Blood Bank Registrations ({bloodBanks.length})</h3>
            <div className="bank-grid">
                {bloodBanks.map(bank => (
                    <div key={bank.id} className="bank-card">
                        <div className="card-header">
                            <h4>{bank.name}</h4>
                            <span className={`status-badge ${bank.stockStatus === 'Low Stock' ? 'low' : 'good'}`}>
                                {bank.stockStatus}
                            </span>
                        </div>
                        <div className="card-body">
                            <p><strong>City:</strong> {bank.city}</p>
                            <p><strong>Contact:</strong> {bank.contactNumber}</p>
                            <p><strong>Groups:</strong> {bank.availableBloodGroups.join(', ')}</p>
                        </div>
                        <div className="card-footer">
                            <button
                                className="btn-delete"
                                onClick={() => handleDelete(bank.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
