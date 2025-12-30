import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './DonorListUser.css';

export default function DonorListUser() {
    const { user } = useAuth();
    const [donors, setDonors] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        loadDonors();
    }, [user]);

    const loadDonors = () => {
        const storedDonors = JSON.parse(localStorage.getItem('nblocator_donors') || '[]');
        const userDonors = storedDonors.filter(donor => donor.userId === user.id);
        setDonors(userDonors);
    };

    const handleDelete = (donorId) => {
        if (window.confirm('Are you sure you want to delete this donor?')) {
            const storedDonors = JSON.parse(localStorage.getItem('nblocator_donors') || '[]');
            const updatedDonors = storedDonors.filter(donor => donor.id !== donorId);
            localStorage.setItem('nblocator_donors', JSON.stringify(updatedDonors));
            loadDonors();
        }
    };

    const handleEdit = (donor) => {
        setEditingId(donor.id);
        setEditFormData({ ...donor });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFormData({});
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveEdit = (donorId) => {
        const storedDonors = JSON.parse(localStorage.getItem('nblocator_donors') || '[]');
        const updatedDonors = storedDonors.map(donor =>
            donor.id === donorId ? { ...editFormData, updatedAt: new Date().toISOString() } : donor
        );
        localStorage.setItem('nblocator_donors', JSON.stringify(updatedDonors));
        setEditingId(null);
        setEditFormData({});
        loadDonors();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    if (donors.length === 0) {
        return (
            <div className="donor-list-user">
                <h3>My Donor Registrations</h3>
                <div className="empty-state">
                    <p>📋 No donors registered yet</p>
                    <p className="empty-subtitle">Add your first donor using the form above</p>
                </div>
            </div>
        );
    }

    return (
        <div className="donor-list-user">
            <h3>My Donor Registrations ({donors.length})</h3>
            <div className="donor-cards">
                {donors.map(donor => (
                    <div key={donor.id} className="donor-card">
                        {editingId === donor.id ? (
                            <div className="edit-form">
                                <div className="edit-field">
                                    <label>Full Name:</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={editFormData.fullName}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="edit-field">
                                    <label>Blood Group:</label>
                                    <select
                                        name="bloodGroup"
                                        value={editFormData.bloodGroup}
                                        onChange={handleEditChange}
                                    >
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                            <option key={group} value={group}>{group}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="edit-field">
                                    <label>Age:</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={editFormData.age}
                                        onChange={handleEditChange}
                                        min="18"
                                        max="65"
                                    />
                                </div>
                                <div className="edit-field">
                                    <label>Phone:</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={editFormData.phoneNumber}
                                        onChange={handleEditChange}
                                        maxLength="10"
                                    />
                                </div>
                                <div className="edit-field">
                                    <label>Location:</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editFormData.location}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="edit-field">
                                    <label>Availability:</label>
                                    <select
                                        name="availabilityStatus"
                                        value={editFormData.availabilityStatus}
                                        onChange={handleEditChange}
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Not Available">Not Available</option>
                                    </select>
                                </div>
                                <div className="edit-actions">
                                    <button onClick={() => handleSaveEdit(donor.id)} className="btn-save">
                                        Save
                                    </button>
                                    <button onClick={handleCancelEdit} className="btn-cancel">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="donor-header">
                                    <h4>{donor.fullName}</h4>
                                    <span className={`blood-badge ${donor.bloodGroup.replace('+', 'pos').replace('-', 'neg')}`}>
                                        {donor.bloodGroup}
                                    </span>
                                </div>
                                <div className="donor-details">
                                    <div className="detail-row">
                                        <span className="label">Age:</span>
                                        <span className="value">{donor.age} years</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Phone:</span>
                                        <span className="value">{donor.phoneNumber}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Location:</span>
                                        <span className="value">{donor.location}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Availability:</span>
                                        <span className={`status-badge ${donor.availabilityStatus.toLowerCase().replace(' ', '-')}`}>
                                            {donor.availabilityStatus}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Last Donation:</span>
                                        <span className="value">{formatDate(donor.lastDonationDate)}</span>
                                    </div>
                                </div>
                                <div className="donor-actions">
                                    <button onClick={() => handleEdit(donor)} className="btn-edit">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(donor.id)} className="btn-delete">
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
