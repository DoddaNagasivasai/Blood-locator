import React, { useState } from 'react';
import './ResultsSection.css';

export default function ResultsSection({ results, searchMeta }) {
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Only show results if they exist (searching is underway or completed)
    if (results === null) {
        return null;
    }

    const isDonor = searchMeta.type === 'donor';

    const handleDonorClick = (donor) => {
        if (isDonor) {
            setSelectedDonor(donor);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDonor(null);
    };

    return (
        <section className="results-section" id="results">
            <div className="section-header">
                <h2>{isDonor ? 'Available Donors' : 'Blood Bank Availability'}</h2>
                <p className="section-subtitle">
                    {results.length > 0
                        ? `Found ${results.length} match(es) for blood group ${searchMeta.bloodGroup}`
                        : `No ${isDonor ? 'donors' : 'blood banks'} available for the selected blood group.`}
                </p>
            </div>

            {results.length > 0 && (
                <div className="results-grid">
                    {results.map((item) => (
                        <div
                            key={item.id}
                            className={`result-card ${isDonor ? 'clickable' : ''}`}
                            onClick={() => handleDonorClick(item)}
                        >
                            <div className="card-header">
                                <span className={`badge ${isDonor ? 'badge-blue' : 'badge-purple'}`}>
                                    {isDonor ? 'Blood Donor' : 'Blood Bank'}
                                </span>
                                <span className={`status-text ${(isDonor ? item.availabilityStatus === 'Available' : item.stockStatus !== 'Low Stock')
                                    ? 'text-success' : 'text-danger'
                                    }`}>
                                    {isDonor ? item.availabilityStatus : item.stockStatus}
                                </span>
                            </div>

                            <div className="card-body">
                                <h3 className="card-title">{isDonor ? item.fullName || item.username : item.name || item.bloodBankName}</h3>
                                <div className="card-details">
                                    <div className="detail-row">
                                        <span className="icon">🩸</span>
                                        <span className="detail-text"><strong>{searchMeta.bloodGroup}</strong></span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="icon">📍</span>
                                        <span className="detail-text">{isDonor ? item.location : item.address}</span>
                                    </div>
                                    {isDonor && item.age && (
                                        <div className="detail-row">
                                            <span className="icon">👤</span>
                                            <span className="detail-text">Age: {item.age} years</span>
                                        </div>
                                    )}
                                    {!isDonor && item.availableBloodGroups && (
                                        <div className="detail-row">
                                            <span className="icon">🏥</span>
                                            <div className="blood-tag-container">
                                                {item.availableBloodGroups.map(group => (
                                                    <span key={group} className="blood-tag-mini">{group}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="contact-info-mini">
                                    <span className="icon">📞</span>
                                    <span>{isDonor ? item.phoneNumber : item.contactNumber}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Donor Details Modal */}
            {showModal && selectedDonor && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Donor Details</h2>
                            <button className="modal-close" onClick={handleCloseModal}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="donor-detail-grid">
                                <div className="donor-detail-item">
                                    <span className="detail-label">👤 Full Name</span>
                                    <span className="detail-value">{selectedDonor.fullName || selectedDonor.name}</span>
                                </div>
                                <div className="donor-detail-item">
                                    <span className="detail-label">🩸 Blood Group</span>
                                    <span className="detail-value blood-group-highlight">{selectedDonor.bloodGroup}</span>
                                </div>
                                <div className="donor-detail-item">
                                    <span className="detail-label">📞 Phone Number</span>
                                    <span className="detail-value">{selectedDonor.phoneNumber}</span>
                                </div>
                                <div className="donor-detail-item">
                                    <span className="detail-label">📍 Location</span>
                                    <span className="detail-value">{selectedDonor.location}</span>
                                </div>
                                {selectedDonor.age && (
                                    <div className="donor-detail-item">
                                        <span className="detail-label">🎂 Age</span>
                                        <span className="detail-value">{selectedDonor.age} years</span>
                                    </div>
                                )}
                                <div className="donor-detail-item">
                                    <span className="detail-label">✅ Availability Status</span>
                                    <span className={`detail-value ${selectedDonor.availabilityStatus === 'Available' ? 'status-available' : 'status-unavailable'}`}>
                                        {selectedDonor.availabilityStatus}
                                    </span>
                                </div>
                                {selectedDonor.createdAt && (
                                    <div className="donor-detail-item">
                                        <span className="detail-label">📅 Registered Since</span>
                                        <span className="detail-value">
                                            {new Date(selectedDonor.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
