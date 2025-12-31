import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function DonorDashboard() {
    const { user } = useAuth();
    const [donorData, setDonorData] = useState({
        age: '',
        phone: user?.phone || '',
        city: user?.city || '',
        bloodGroup: user?.bloodGroup || '',
        availabilityStatus: true,
        latitude: null,    // ADD THIS
        longitude: null    // ADD THIS
    });
    const [nearbyRequests, setNearbyRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null); // For detail modal
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const API_URL = "http://localhost:5000/api";
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchDonorProfile();
        fetchRequests();
    }, []);

    const fetchDonorProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/donors/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.found) {
                setDonorData({
                    age: data.donor.age || '',
                    phone: data.donor.phone || '',
                    city: data.donor.city || '',
                    bloodGroup: data.donor.bloodGroup || '',
                    availabilityStatus: data.donor.availabilityStatus
                });
            }
        } catch (error) {
            console.error("Error fetching donor profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await fetch(`${API_URL}/recipients/`);
            const data = await response.json();
            setNearbyRequests(data || []);
        } catch (error) {
            console.error("Error fetching blood requests:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDonorData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${API_URL}/donors/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(donorData)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: data.msg });
            } else {
                setMessage({ type: 'error', text: data.msg || "Failed to update profile" });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Connection error. Please try again." });
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
    const detectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const data = await response.json();
                        const city = data.address.city || data.address.town || data.address.village || '';
                        setDonorData(prev => ({
                            ...prev,
                            city: city,
                            latitude: latitude,    // ADD THIS
                            longitude: longitude   // ADD THIS
                        }));

                        if (data.results && data.results[0]) {
                            const addressComponents = data.results[0].address_components;
                            const city = addressComponents.find(
                                component => component.types.includes('locality')
                            )?.long_name || '';

                            setDonorData(prev => ({
                                ...prev,
                                city: city,
                                latitude: latitude,    // ADD THIS
                                longitude: longitude   // ADD THIS
                            }));
                            setMessage({ type: 'success', text: 'Location detected successfully!' });
                        }
                    } catch (error) {
                        setMessage({ type: 'error', text: 'Failed to detect location' });
                    }
                },
                (error) => {
                    setMessage({ type: 'error', text: 'Location permission denied' });
                }
            );
        }
    };
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="container">
                    <h1>Welcome, {user?.username || 'Donor'}! 🩸</h1>
                    <p className="dashboard-subtitle">Manage Your Donor Profile</p>
                </div>
            </div>

            <div className="container dashboard-content">
                <div className="card">
                    <h3>{donorData.bloodGroup ? "Update Your Donor Profile" : "Complete Your Donor Profile"}</h3>

                    {message.text && (
                        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '1rem' }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="entry-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Blood Group</label>
                                <select
                                    name="bloodGroup"
                                    className="form-control"
                                    value={donorData.bloodGroup}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Age (Optional)</label>
                                <input
                                    type="number"
                                    name="age"
                                    className="form-control"
                                    value={donorData.age}
                                    onChange={handleChange}
                                    placeholder="Enter age"
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    value={donorData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Phone number"
                                />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        name="city"
                                        className="form-control"
                                        value={donorData.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter city"
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={detectLocation}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                                    >
                                        📍 Detect
                                    </button>
                                </div>
                            </div>

                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '1.5rem' }}>
                                <input
                                    type="checkbox"
                                    name="availabilityStatus"
                                    checked={donorData.availabilityStatus}
                                    onChange={handleChange}
                                />
                                <label>Available to Donate</label>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                            Save Profile
                        </button>
                    </form>
                </div>

                <div className="card" style={{ marginTop: '2rem' }}>
                    <h3>Recent Blood Requests Nearby</h3>
                    {nearbyRequests.length > 0 ? (
                        <div className="grid-summary" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                            {nearbyRequests.map(req => (
                                <div key={req.id} className="request-item card" style={{ padding: '1rem', border: '1px solid #eee', backgroundColor: '#fdfdfd' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <strong style={{ fontSize: '1.2rem', color: '#e74c3c' }}>{req.requiredBloodGroup}</strong>
                                        <span className={`badge badge-${req.urgencyLevel?.toLowerCase()}`}>{req.urgencyLevel}</span>
                                    </div>
                                    <p style={{ margin: '0 0 0.5rem 0' }}><strong>Patient:</strong> {req.name}</p>
                                    <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>📍 {req.city}</p>
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        style={{ marginTop: '1rem', width: '100%' }}
                                        onClick={() => setSelectedRequest(req)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No urgent requests in your area currently.</p>
                    )}
                </div>

                {/* Blood Request Detail Modal */}
                {selectedRequest && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
                        alignItems: 'center', zIndex: 1000
                    }}>
                        <div className="modal-content card" style={{
                            width: '90%', maxWidth: '500px', padding: '2rem', position: 'relative'
                        }}>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                &times;
                            </button>
                            <h2 style={{ color: '#e74c3c', marginBottom: '1.5rem' }}>🩸 Blood Request Details</h2>
                            <div className="detail-grid" style={{ display: 'grid', gap: '1rem' }}>
                                <p><strong>Patient Name:</strong> {selectedRequest.name}</p>
                                <p><strong>Required Blood Group:</strong> <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{selectedRequest.requiredBloodGroup}</span></p>
                                <p><strong>Urgency Level:</strong> <span className={`badge badge-${selectedRequest.urgencyLevel?.toLowerCase()}`}>{selectedRequest.urgencyLevel}</span></p>
                                <p><strong>City:</strong> {selectedRequest.city}</p>
                                <div style={{ borderTop: '1px solid #eee', marginTop: '1rem', paddingTop: '1rem' }}>
                                    <h4 style={{ marginBottom: '0.5rem' }}>Contact Information</h4>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>📞 {selectedRequest.phone}</p>
                                </div>
                            </div>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: '2rem', width: '100%' }}
                                onClick={() => setSelectedRequest(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
