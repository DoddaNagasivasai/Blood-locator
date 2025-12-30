import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-column">
                    <h3 className="footer-logo">Nearest Blood Locator</h3>
                    <p>Connecting donors with those in need. Every drop counts.</p>
                </div>
                <div className="footer-column">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><a href="/#donors">Find Donors</a></li>
                        <li><a href="/#banks">Blood Banks</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Contact</h4>
                    <ul>
                        <li>help@bloodlocator.com</li>
                        <li>+1 (555) 123-4567</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Nearest Blood Locator. All rights reserved.</p>
            </div>
        </footer>
    );
}
