import React from 'react';
import './Hero.css';

export default function Hero() {
    return (
        <section className="hero" id="home">
            <div className="hero-overlay">
                <div className="container hero-content">
                    <h1 className="hero-title">Find Blood Near You,<br />Save Lives</h1>
                    <p className="hero-subtitle">
                        Immediate access to blood donors and blood banks in your area used by thousands of hospitals and emergency centers.
                    </p>
                </div>
            </div>
        </section>
    );
}
