import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

export default function Home() {
    return (
        <>
            <Hero />
            <div className="main-content">
                <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
                        Find Blood When You Need It Most
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Our platform connects blood donors with those in need.
                        Join our community to access real-time blood availability,
                        locate nearby blood banks, and find willing donors.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link
                            to="/register"
                            className="btn btn-primary"
                            style={{
                                padding: '0.75rem 2rem',
                                fontSize: '1.1rem',
                                textDecoration: 'none'
                            }}
                        >
                            Get Started - Register Now
                        </Link>
                        <Link
                            to="/login"
                            className="btn"
                            style={{
                                padding: '0.75rem 2rem',
                                fontSize: '1.1rem',
                                textDecoration: 'none',
                                border: '2px solid var(--primary)',
                                color: 'var(--primary)',
                                background: 'white'
                            }}
                        >
                            Already Have an Account? Login
                        </Link>
                    </div>

                    <div style={{ marginTop: '4rem', padding: '2rem', background: '#f9f9f9', borderRadius: '8px' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Why Join Us?</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
                            <div>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>🔍 Find Blood Availability</h4>
                                <p style={{ color: '#666', margin: 0 }}>Search for available blood types in your area instantly</p>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>🏥 Nearby Blood Banks</h4>
                                <p style={{ color: '#666', margin: 0 }}>Locate blood banks closest to your location</p>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>👥 Find Blood Donors</h4>
                                <p style={{ color: '#666', margin: 0 }}>Connect with willing donors in your community</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
