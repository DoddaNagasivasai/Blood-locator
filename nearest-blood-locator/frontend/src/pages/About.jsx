import React from 'react';
import './About.css';

export default function About() {
    return (
        <div className="about-page container">
            <div className="about-header">
                <h1>About Nearest Blood Locator</h1>
                <p className="lead-text">Connecting donors, patients, and blood banks to save lives instantly.</p>
            </div>

            <section className="about-section">
                <h2>Our Purpose</h2>
                <p>
                    In medical emergencies, finding the right blood group quickly can be a matter of life and death.
                    <strong>Nearest Blood Locator</strong> was created to bridge the critical gap between those in need of blood
                    and ready donors or blood banks nearby. We aim to reduce the time spent searching for blood
                    by providing a real-time, centralized platform.
                </p>
            </section>

            <div className="features-grid">
                <div className="feature-card">
                    <span className="feature-icon">🔍</span>
                    <h3>Instant Search</h3>
                    <p>Find available blood donors and banks in your specific locality within seconds.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">🩸</span>
                    <h3>Real-time Availability</h3>
                    <p>See live status updates from donors and blood banks to avoid wasted trips.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">🤝</span>
                    <h3>Direct Connection</h3>
                    <p>Contact donors or banks directly through the platform to coordinate donation.</p>
                </div>
            </div>

            <section className="about-section mission-section">
                <h2>Our Mission</h2>
                <p>
                    To ensure that <strong>no life is lost due to the unavailability of blood</strong>.
                    We strive to build the largest network of voluntary blood donors and verified blood banks,
                    making blood donation as accessible and efficient as possible for every community.
                </p>
            </section>
        </div>
    );
}
