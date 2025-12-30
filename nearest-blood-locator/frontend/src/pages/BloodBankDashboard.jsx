import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function BloodBankDashboard() {
    const { user } = useAuth();
    const [stock, setStock] = useState([]);
    const [myBank, setMyBank] = useState(null);
    const [nearbyRequests, setNearbyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Forms
    const [bankForm, setBankForm] = useState({
        name: '',
        address: '',
        city: user?.city || '',
        contactNumber: user?.phone || '',
        availableBloodGroups: []
    });
    const [updateForm, setUpdateForm] = useState({ bloodGroup: '', quantity: '' });
    const [addForm, setAddForm] = useState({ bloodGroup: '', quantity: '' });
    const [showBankForm, setShowBankForm] = useState(false);

    const API_URL = "http://localhost:5000/api";
    const token = localStorage.getItem('token');

    useEffect(() => {
        initDashboard();
    }, []);

    const initDashboard = async () => {
        setLoading(true);
        await Promise.all([fetchStock(), fetchMyBank(), fetchRequests()]);
        setLoading(false);
    };

    const fetchRequests = async () => {
        try {
            const response = await fetch(`${API_URL}/recipients/`);
            const data = await response.json();
            setNearbyRequests(data || []);
        } catch (error) {
            console.error("Failed to load requests");
        }
    };

    const fetchStock = async () => {
        try {
            const response = await fetch(`${API_URL}/blood-stock/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setStock(data);
        } catch (err) {
            console.error("Failed to load stock");
        }
    };

    const fetchMyBank = async () => {
        try {
            const response = await fetch(`${API_URL}/bloodbanks/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.length > 0) {
                setMyBank(data[0]); // For now, assume one user manages one bank
                setBankForm({
                    name: data[0].name,
                    address: data[0].address || '',
                    city: data[0].city,
                    contactNumber: data[0].contactNumber,
                    availableBloodGroups: data[0].availableBloodGroups || []
                });
            }
        } catch (err) {
            console.error("Failed to load bank profile");
        }
    };

    const handleBankFormChange = (e) => {
        const { name, value } = e.target;
        setBankForm(prev => ({ ...prev, [name]: value }));
    };

    const handleBloodGroupsChange = (group) => {
        const current = [...bankForm.availableBloodGroups];
        const index = current.indexOf(group);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(group);
        }
        setBankForm(prev => ({ ...prev, availableBloodGroups: current }));
    };

    const handleSubmitBank = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${API_URL}/bloodbanks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bankForm)
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: "Blood Bank profile saved!" });
                fetchMyBank();
                setShowBankForm(false);
            } else {
                setMessage({ type: 'error', text: data.msg || "Failed to save bank info" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Connection error" });
        }
    };

    const handleUpdateStock = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const res = await fetch(`${API_URL}/blood-stock/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateForm)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: "Stock updated successfully!" });
                fetchStock();
                setUpdateForm({ bloodGroup: '', quantity: '' });
            } else {
                setMessage({ type: 'error', text: data.msg || "Update failed" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Connection error" });
        }
    };

    const handleAddStock = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const res = await fetch(`${API_URL}/blood-stock/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(addForm)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: data.msg || "New blood group added!" });
                fetchStock();
                setAddForm({ bloodGroup: '', quantity: '' });
            } else {
                setMessage({ type: 'error', text: data.msg || "Add failed" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Connection error" });
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header" style={{ backgroundColor: '#2c3e50' }}>
                <div className="container">
                    <h1>🏥 {myBank?.name || 'Blood Bank'} Dashboard</h1>
                    <p className="dashboard-subtitle">Manage Facility Details & Inventory</p>
                </div>
            </div>

            <div className="container dashboard-content">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>{myBank ? "Blood Bank Information" : "Register Your Blood Bank"}</h3>
                        <button className="btn btn-secondary" onClick={() => setShowBankForm(!showBankForm)}>
                            {showBankForm ? 'Cancel' : (myBank ? 'Edit Profile' : 'Register Now')}
                        </button>
                    </div>

                    {showBankForm ? (
                        <form onSubmit={handleSubmitBank} className="entry-form">
                            {message.text && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Blood Bank Name</label>
                                    <input type="text" name="name" className="form-control" value={bankForm.name} onChange={handleBankFormChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Contact Number</label>
                                    <input type="tel" name="contactNumber" className="form-control" value={bankForm.contactNumber} onChange={handleBankFormChange} required />
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" name="city" className="form-control" value={bankForm.city} onChange={handleBankFormChange} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Address</label>
                                    <textarea name="address" className="form-control" value={bankForm.address} onChange={handleBankFormChange} rows="2"></textarea>
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Available Blood Groups (Check all that apply)</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                            <div key={bg} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={bankForm.availableBloodGroups.includes(bg)}
                                                    onChange={() => handleBloodGroupsChange(bg)}
                                                /> {bg}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Profile</button>
                        </form>
                    ) : (
                        myBank ? (
                            <div className="grid-summary">
                                <div><p><strong>📍 Location:</strong> {myBank.city}</p><p><strong>✉️ Address:</strong> {myBank.address || 'N/A'}</p></div>
                                <div><p><strong>📞 Contact:</strong> {myBank.contactNumber}</p><p><strong>🩸 Groups:</strong> {myBank.availableBloodGroups.join(', ') || 'None listed'}</p></div>
                            </div>
                        ) : <p className="text-muted">You haven't registered your blood bank profile yet. Click 'Register Now' to get started.</p>
                    )}
                </div>

                <div className="card" style={{ marginTop: '2rem' }}>
                    <h3>Inventory Status</h3>
                    {loading ? <p>Loading...</p> : (
                        <div className="grid-summary">
                            {stock.length > 0 ? stock.map(s => (
                                <div key={s.id} className={`stat-box ${s.quantity < 5 ? 'text-danger' : ''}`}>
                                    {s.bloodGroup} <span>{s.quantity} units</span>
                                </div>
                            )) : <p>No stock data recorded yet.</p>}
                        </div>
                    )}
                </div>

                <div className="grid-summary" style={{ marginTop: '2rem', gap: '2rem' }}>
                    <div className="card">
                        <h4>Update Existing Stock</h4>
                        {message.text && !showBankForm && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '1rem' }}>{message.text}</div>}
                        <form onSubmit={handleUpdateStock}>
                            <div className="form-group">
                                <label>Blood Group</label>
                                <select className="form-control" value={updateForm.bloodGroup} onChange={e => setUpdateForm({ ...updateForm, bloodGroup: e.target.value })} required>
                                    <option value="">Select</option>
                                    {stock.map(s => <option key={s.id} value={s.bloodGroup}>{s.bloodGroup}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input type="number" className="form-control" value={updateForm.quantity} onChange={e => setUpdateForm({ ...updateForm, quantity: e.target.value })} required min="0" />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Update</button>
                        </form>
                    </div>

                    <div className="card">
                        <h4>Add New Blood Type</h4>
                        {message.text && !showBankForm && <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '1rem' }}>{message.text}</div>}
                        <form onSubmit={handleAddStock}>
                            <div className="form-group">
                                <label>Blood Group</label>
                                <select className="form-control" value={addForm.bloodGroup} onChange={e => setAddForm({ ...addForm, bloodGroup: e.target.value })} required>
                                    <option value="">Select</option>
                                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Initial Quantity</label>
                                <input type="number" className="form-control" value={addForm.quantity} onChange={e => setAddForm({ ...addForm, quantity: e.target.value })} required min="0" />
                            </div>
                            <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Add Entry</button>
                        </form>
                    </div>
                </div>
                <div className="card" style={{ marginTop: '2rem' }}>
                    <h3>Urgent Blood Requests Nearby</h3>
                    {nearbyRequests.length > 0 ? (
                        <div className="grid-summary" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {nearbyRequests.map(req => (
                                <div key={req.id} className="request-item card" style={{ padding: '1.2rem', border: '1px solid #eee', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                        <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#c0392b' }}>{req.requiredBloodGroup}</span>
                                        <span className={`badge badge-${req.urgencyLevel?.toLowerCase()}`}>{req.urgencyLevel}</span>
                                    </div>
                                    <p style={{ margin: '0 0 0.5rem 0' }}><strong>Patient:</strong> {req.name}</p>
                                    <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.95rem' }}>📍 {req.city}</p>
                                    <div style={{ borderTop: '1px solid #eee', paddingTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span className="icon">📞</span>
                                        <strong>{req.phone}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No urgent blood requests reported in this area.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
