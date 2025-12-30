import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AddBloodBankForm.css';

const API_URL = "http://localhost:5000/api";

export default function AddBloodBankForm() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        bloodBankName: '',
        city: '',
        address: '',
        contactNumber: '',
        availableBloodGroups: [],
        stockStatus: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const stockStatusOptions = ['Well Stocked', 'Moderate', 'Low Stock'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBloodGroupChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            availableBloodGroups: checked
                ? [...prev.availableBloodGroups, value]
                : prev.availableBloodGroups.filter(group => group !== value)
        }));
        if (errors.availableBloodGroups) {
            setErrors(prev => ({ ...prev, availableBloodGroups: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.bloodBankName.trim()) {
            newErrors.bloodBankName = 'Blood bank name is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.contactNumber) {
            newErrors.contactNumber = 'Contact number is required';
        }

        if (formData.availableBloodGroups.length === 0) {
            newErrors.availableBloodGroups = 'Please select at least one blood group';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/bloodbanks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.bloodBankName,
                    city: formData.city,
                    address: formData.address,
                    contactNumber: formData.contactNumber,
                    availableBloodGroups: formData.availableBloodGroups,
                    stockStatus: formData.stockStatus
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Failed to create blood bank");
            }

            setSuccessMessage('Blood bank information added successfully! 🏥');
            setFormData({
                bloodBankName: '',
                city: '',
                address: '',
                contactNumber: '',
                availableBloodGroups: [],
                stockStatus: ''
            });

        } catch (error) {
            console.error("Error creating blood bank:", error);
            setErrors(prev => ({ ...prev, submit: error.message }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-blood-bank-form">
            <div className="form-header">
                <h2>Add Blood Bank Information</h2>
                <p>Register a blood bank to help people in need</p>
            </div>

            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            {errors.submit && (
                <div className="error-message" style={{ marginBottom: '1rem', display: 'block' }}>{errors.submit}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label htmlFor="bloodBankName">Blood Bank Name *</label>
                        <input
                            type="text"
                            id="bloodBankName"
                            name="bloodBankName"
                            value={formData.bloodBankName}
                            onChange={handleChange}
                            placeholder="Enter blood bank name"
                            className={errors.bloodBankName ? 'error' : ''}
                        />
                        {errors.bloodBankName && <span className="error-message">{errors.bloodBankName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="e.g. Metro City"
                            className={errors.city ? 'error' : ''}
                        />
                        {errors.city && <span className="error-message">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number *</label>
                        <input
                            type="tel"
                            id="contactNumber"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="Enter 10-digit number"
                            className={errors.contactNumber ? 'error' : ''}
                        />
                        {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter complete address"
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="stockStatus">Stock Status</label>
                        <select
                            id="stockStatus"
                            name="stockStatus"
                            value={formData.stockStatus}
                            onChange={handleChange}
                        >
                            <option value="">Select status</option>
                            {stockStatusOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label>Available Blood Groups *</label>
                        <div className="checkbox-group">
                            {bloodGroups.map(group => (
                                <label key={group} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        value={group}
                                        checked={formData.availableBloodGroups.includes(group)}
                                        onChange={handleBloodGroupChange}
                                    />
                                    <span className="checkbox-text">{group}</span>
                                </label>
                            ))}
                        </div>
                        {errors.availableBloodGroups && <span className="error-message">{errors.availableBloodGroups}</span>}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Adding...' : 'Add Blood Bank Information'}
                    </button>
                </div>
            </form>
        </div>
    );
}
