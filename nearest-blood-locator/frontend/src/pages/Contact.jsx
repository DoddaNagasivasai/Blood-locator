import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in all required fields (Name, Email, Message).');
            return;
        }

        // Simulate API call
        console.log('Form Submitted:', formData);
        setSubmitted(true);

        // Reset after success
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page container">
            <div className="contact-header">
                <h1>Contact Us</h1>
                <p>We are here to help. Reach out to us for support, feedback, or blood requests.</p>
            </div>

            <div className="contact-grid">
                {/* Contact Info Side */}
                <div className="contact-info">
                    <div className="info-card emergency-card">
                        <h3>🚨 Emergency Support</h3>
                        <p>Need blood urgently? Call our 24/7 helpline immediately.</p>
                        <a href="tel:+1800-123-4567" className="emergency-btn">Call 1800-123-4567</a>
                    </div>

                    <div className="info-card">
                        <h3>General Inquiries</h3>
                        <div className="info-item">
                            <span className="icon">📧</span>
                            <p>support@bloodlocator.com</p>
                        </div>
                        <div className="info-item">
                            <span className="icon">📍</span>
                            <p>123 Health Street, MedCity, NY 10001</p>
                        </div>
                        <div className="info-item">
                            <span className="icon">🕒</span>
                            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form Side */}
                <div className="contact-form-container">
                    {submitted ? (
                        <div className="success-message">
                            <h3>Thank You!</h3>
                            <p>Your message has been received. Our team will contact you shortly.</p>
                            <button className="btn btn-outline" onClick={() => setSubmitted(false)}>Send Another Message</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="contact-form">
                            <h3>Send us a Message</h3>
                            {error && <div className="error-alert">{error}</div>}

                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="form-control"
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary btn-full">Submit Message</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
