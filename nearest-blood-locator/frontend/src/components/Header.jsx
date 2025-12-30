import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <span className="logo-icon">🩸</span>
                    Nearest Blood Locator
                </Link>

                <button
                    className="mobile-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="nav-list">
                        {user ? (
                            // Authenticated navigation
                            <>
                                <li><Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                                <li><Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                                <li><Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
                                <li className="user-info">
                                    <span className="user-name">👤 {user.name}</span>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="nav-link btn-link logout-btn"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            // Public navigation
                            <>
                                <li><Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                                <li><Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                                <li><Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
                                <li><Link to="/login" className="nav-link btn-link" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
                                <li><Link to="/register" className="nav-link btn-link" style={{ marginLeft: '0.5rem', backgroundColor: 'var(--primary)', color: 'white' }} onClick={() => setIsMenuOpen(false)}>Register</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
