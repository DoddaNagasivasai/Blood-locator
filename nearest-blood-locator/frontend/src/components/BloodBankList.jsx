import React, { useState, useEffect } from 'react';
import './BloodBankList.css'; // Assuming styling is similar or exists

const API_URL = "http://localhost:5000/api";

export default function BloodBankList() {
    const [bloodBanks, setBloodBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBloodBanks = async () => {
            try {
                const response = await fetch(`${API_URL}/bloodbanks`);
                if (!response.ok) {
                    throw new Error("Failed to fetch blood banks");
                }
                const data = await response.json();
                setBloodBanks(data);
            } catch (err) {
                console.error(err);
                setError("Could not load blood banks.");
            } finally {
                setLoading(false);
            }
        };

        fetchBloodBanks();
    }, []);

    if (loading) return <div>Loading blood banks...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="blood-bank-list-container">
            <h2>Nearby Blood Banks</h2>
            {bloodBanks.length === 0 ? (
                <p>No blood banks registered yet.</p>
            ) : (
                <div className="bank-grid">
                    {bloodBanks.map(bank => (
                        <div key={bank.id} className="bank-card">
                            <h3>{bank.name}</h3>
                            <p><strong>City:</strong> {bank.city}</p>
                            <p><strong>Contact:</strong> {bank.contactNumber}</p>
                            <p><strong>Address:</strong> {bank.address || 'N/A'}</p>
                            <div className="tags">
                                {bank.availableBloodGroups.map(bg => (
                                    <span key={bg} className="tag">{bg}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
