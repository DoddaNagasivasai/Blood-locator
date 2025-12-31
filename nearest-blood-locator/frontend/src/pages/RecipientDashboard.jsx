import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SearchSection from './SearchSection';
import ResultsSection from '../components/ResultsSection';
import './Dashboard.css';
import MapNavigationButton from '../components/MapNavigationButton';

export default function RecipientDashboard() {
    const { user } = useAuth();
    const [searchResults, setSearchResults] = useState(null);
    const [searchMeta, setSearchMeta] = useState({ type: 'donor', bloodGroup: '' });

    // Request Blood Form State
    const [requestData, setRequestData] = useState({
        name: '',
        requiredBloodGroup: '',
        city: user?.city || '',
        phone: user?.phone || '',
        urgencyLevel: 'Medium'
    });
    const [myRequests, setMyRequests] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showForm, setShowForm] = useState(false);

    const API_URL = "http://localhost:5000/api";
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            const response = await fetch(`${API_URL}/recipients/my-requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMyRequests(data.requests || []);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    const handleSearch = async (criteria) => {
        try {
            const endpoint = criteria.searchType === 'donor' ? 'donors' : 'bloodbanks';
            const queryParams = new URLSearchParams({
                bloodGroup: criteria.bloodGroup,
                location: criteria.location
            }).toString();

            const response = await fetch(`${API_URL}/${endpoint}/?${queryParams}`);
            const data = await response.json();

            // Mapping for ResultsSection compatibility
            setSearchResults(data);
            setSearchMeta({
                type: criteria.searchType,
                bloodGroup: criteria.bloodGroup
            });
        } catch (error) {
            console.error("Search failed:", error);
            setMessage({ type: 'error', text: "Failed to fetch search results. Please try again." });
        }
    };

    const handleRequestChange = (e) => {
        const { name, value } = e.target;
        setRequestData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancelRequest = async () => {
        if (!window.confirm("Are you sure you want to cancel this blood request?")) return;

        try {
            const response = await fetch(`${API_URL}/recipients/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: "Blood request cancelled." });
                fetchMyRequests();
            } else {
                setMessage({ type: 'error', text: data.msg || "Failed to cancel request" });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Connection error. Please try again." });
        }
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${API_URL}/recipients/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: "Blood request posted successfully!" });
                setRequestData({
                    name: '',
                    requiredBloodGroup: '',
                    city: user?.city || '',
                    phone: user?.phone || '',
                    urgencyLevel: 'Medium'
                });
                setShowForm(false);
                fetchMyRequests();
            } else {
                setMessage({ type: 'error', text: data.msg || "Failed to post request" });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Connection error. Please try again." });
        }
    };
    const detectLocationForRequest = () => {
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
                        setFormData(prev => ({ ...prev, city: city }));

                        if (data.results && data.results[0]) {
                            const addressComponents = data.results[0].address_components;
                            const city = addressComponents.find(
                                component => component.types.includes('locality')
                            )?.long_name || '';

                            setRequestData(prev => ({ ...prev, city: city }));
                            setMessage({ type: 'success', text: 'Location detected!' });
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
            <div className="dashboard-header" style={{ backgroundColor: '#16a085' }}>
                <div className="container">
                    <h1>Welcome, {user?.username || 'User'}! 🔍</h1>
                    <p className="dashboard-subtitle">Find Blood Donors & Banks or Post a Request</p>
                </div>
            </div>

            <div className="container dashboard-content">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>Start Your Search</h3>
                        <button
                            className={`btn ${showForm ? 'btn-secondary' : 'btn-danger'}`}
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Cancel Request' : 'Post Blood Request'}
                        </button>
                    </div>

                    {showForm ? (
                        <div className="request-form-container" style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                            <h4>Post an Urgent Blood Request</h4>
                            {message.text && (
                                <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '1rem' }}>
                                    {message.text}
                                </div>
                            )}
                            <form onSubmit={handleSubmitRequest}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Patient/Contact Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={requestData.name}
                                            onChange={handleRequestChange}
                                            placeholder="Enter patient name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Required Blood Group</label>
                                        <select
                                            name="requiredBloodGroup"
                                            className="form-control"
                                            value={requestData.requiredBloodGroup}
                                            onChange={handleRequestChange}
                                            required
                                        >
                                            <option value="">Select</option>
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                                <option key={bg} value={bg}>{bg}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Urgency Level</label>
                                        <select
                                            name="urgencyLevel"
                                            className="form-control"
                                            value={requestData.urgencyLevel}
                                            onChange={handleRequestChange}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>City/Location</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="text"
                                                name="city"
                                                className="form-control"
                                                value={requestData.city}
                                                onChange={handleRequestChange}
                                                required
                                                style={{ flex: 1 }}
                                            />
                                            <button
                                                type="button"
                                                onClick={detectLocationForRequest}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                                            >
                                                📍 Detect
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Contact Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            value={requestData.phone}
                                            onChange={handleRequestChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                    Post Request
                                </button>
                            </form>
                        </div>
                    ) : (
                        <SearchSection onSearch={handleSearch} />
                    )}
                </div>

                {myRequests.length > 0 && (
                    <div className="card" style={{ marginTop: '2rem' }}>
                        <h3>My Active Blood Requests</h3>
                        <div className="grid-summary">
                            {myRequests.map(req => (
                                <div key={req.id} className="request-item card" style={{ padding: '1rem', border: '1px solid #ddd' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>{req.requiredBloodGroup}</strong>
                                        <span className={`badge badge-${req.urgencyLevel.toLowerCase()}`}>{req.urgencyLevel}</span>
                                    </div>
                                    <p style={{ margin: '0.5rem 0' }}>Patient: {req.name}</p>
                                    <p style={{ margin: '0', fontSize: '0.9rem' }}>📍 {req.city} | 📞 {req.phone}</p>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        style={{ marginTop: '1rem', width: '100%', borderColor: '#e74c3c', color: '#e74c3c' }}
                                        onClick={handleCancelRequest}
                                    >
                                        Cancel Request
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {searchResults && (
                    <ResultsSection results={searchResults} searchMeta={searchMeta} />
                )}
            </div>
        </div>
    );
}
