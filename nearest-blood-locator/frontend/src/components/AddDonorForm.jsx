import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AddDonorForm.css';

export default function AddDonorForm() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        bloodGroup: '',
        age: '',
        phoneNumber: '',
        location: '',
        availabilityStatus: '',
        lastDonationDate: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const availabilityOptions = ['Available', 'Not Available'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        // Clear success message when user starts editing
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        // Blood Group validation
        if (!formData.bloodGroup) {
            newErrors.bloodGroup = 'Blood group is required';
        }

        // Age validation
        if (!formData.age) {
            newErrors.age = 'Age is required';
        } else if (formData.age < 18 || formData.age > 65) {
            newErrors.age = 'Age must be between 18 and 65 years';
        }

        // Phone Number validation
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 10 digits';
        }

        // Location validation
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        // Availability Status validation
        if (!formData.availabilityStatus) {
            newErrors.availabilityStatus = 'Availability status is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Create donor object
        const donorData = {
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            ...formData,
            createdAt: new Date().toISOString()
        };

        // Get existing donors from localStorage
        const existingDonors = JSON.parse(localStorage.getItem('nblocator_donors') || '[]');

        // Add new donor
        existingDonors.push(donorData);

        // Save to localStorage
        localStorage.setItem('nblocator_donors', JSON.stringify(existingDonors));

        // Show success message
        setSuccessMessage('Donor information added successfully! 🩸');

        // Reset form
        setFormData({
            fullName: '',
            bloodGroup: '',
            age: '',
            phoneNumber: '',
            location: '',
            availabilityStatus: '',
            lastDonationDate: ''
        });

        // Clear success message after 5 seconds
        setTimeout(() => {
            setSuccessMessage('');
        }, 5000);
    };

    return (
        <div className="add-donor-form">
            <div className="form-header">
                <h2>Add Blood Donor Information</h2>
                <p>Help save lives by registering as a blood donor</p>
            </div>

            {successMessage && (
                <div className="success-message">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    {/* Full Name */}
                    <div className="form-group">
                        <label htmlFor="fullName">
                            Full Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className={errors.fullName ? 'error' : ''}
                        />
                        {errors.fullName && (
                            <span className="error-message">{errors.fullName}</span>
                        )}
                    </div>

                    {/* Blood Group */}
                    <div className="form-group">
                        <label htmlFor="bloodGroup">
                            Blood Group <span className="required">*</span>
                        </label>
                        <select
                            id="bloodGroup"
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            className={errors.bloodGroup ? 'error' : ''}
                        >
                            <option value="">Select blood group</option>
                            {bloodGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                        {errors.bloodGroup && (
                            <span className="error-message">{errors.bloodGroup}</span>
                        )}
                    </div>

                    {/* Age */}
                    <div className="form-group">
                        <label htmlFor="age">
                            Age <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter age (18-65)"
                            min="18"
                            max="65"
                            className={errors.age ? 'error' : ''}
                        />
                        {errors.age && (
                            <span className="error-message">{errors.age}</span>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="form-group">
                        <label htmlFor="phoneNumber">
                            Phone Number <span className="required">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter 10-digit number"
                            maxLength="10"
                            className={errors.phoneNumber ? 'error' : ''}
                        />
                        {errors.phoneNumber && (
                            <span className="error-message">{errors.phoneNumber}</span>
                        )}
                    </div>

                    {/* Location */}
                    <div className="form-group">
                        <label htmlFor="location">
                            Location <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City or area"
                            className={errors.location ? 'error' : ''}
                        />
                        {errors.location && (
                            <span className="error-message">{errors.location}</span>
                        )}
                    </div>

                    {/* Availability Status */}
                    <div className="form-group">
                        <label htmlFor="availabilityStatus">
                            Availability Status <span className="required">*</span>
                        </label>
                        <select
                            id="availabilityStatus"
                            name="availabilityStatus"
                            value={formData.availabilityStatus}
                            onChange={handleChange}
                            className={errors.availabilityStatus ? 'error' : ''}
                        >
                            <option value="">Select availability</option>
                            {availabilityOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {errors.availabilityStatus && (
                            <span className="error-message">{errors.availabilityStatus}</span>
                        )}
                    </div>

                    {/* Last Donation Date */}
                    <div className="form-group full-width">
                        <label htmlFor="lastDonationDate">
                            Last Donation Date <span className="optional">(Optional)</span>
                        </label>
                        <input
                            type="date"
                            id="lastDonationDate"
                            name="lastDonationDate"
                            value={formData.lastDonationDate}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Add Donor Information
                    </button>
                </div>
            </form>
        </div>
    );
}
