import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

// Constants
const API_URL = "http://localhost:5000/api";
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Register() {
  const navigate = useNavigate();

  // State
  const [formData, setFormData] = useState({
    userType: 'donor',
    username: '',
    email: '',
    phone: '',
    city: '',
    bloodGroup: '',
    password: '',
    confirmPassword: '',
    latitude: null,
    longitude: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Auto-detect location on component mount
  useEffect(() => {
    detectLocation();
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error on change
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // Clear general error on change
    if (error) {
      setError('');
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (formData.phone.trim().length < 10) {
      errors.phone = "Phone number must be at least 10 digits";
    }

    if (!formData.city.trim()) {
      errors.city = "Location is required";
    }

    // Blood group validation for donor and recipient
    if ((formData.userType === 'donor' || formData.userType === 'recipient') && !formData.bloodGroup) {
      errors.bloodGroup = `Blood group is required for ${formData.userType}s`;
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const city = data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.county ||
              '';

            setFormData(prev => ({
              ...prev,
              city: city,
              latitude: latitude,
              longitude: longitude
            }));
          } catch (error) {
            console.error('Error getting city name:', error);
            // Still save coordinates even if reverse geocoding fails
            setFormData(prev => ({
              ...prev,
              latitude: latitude,
              longitude: longitude
            }));
          }
        },
        (error) => {
          console.error('Location permission denied:', error);
          setError('Location access denied. Please enter your city manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter your city manually.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validate()) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare payload
      const payload = {
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        password: formData.password,
        userType: formData.userType,
        latitude: formData.latitude,
        longitude: formData.longitude
      };

      // Add blood group for donors and recipients
      if ((formData.userType === 'donor' || formData.userType === 'recipient') && formData.bloodGroup) {
        payload.bloodGroup = formData.bloodGroup;
      }

      console.log('Sending registration data:', {
        ...payload,
        password: '***',
        latitude: payload.latitude,
        longitude: payload.longitude
      });

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.error || "Registration failed");
      }

      // Success
      console.log('Registration successful:', data);
      alert("Registration successful! Please login.");
      navigate('/login');

    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h2>🩸 Create Account</h2>
          <p>Join the Nearest Blood Locator network</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group full-width">
            <label>Register As</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="donor">Blood Donor</option>
              <option value="recipient">Recipient</option>
              <option value="bank">Blood Bank</option>
            </select>
          </div>

          <div className="form-group">
            <label>{formData.userType === 'bank' ? 'Blood Bank Name' : 'Username'}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={formData.userType === 'bank' ? 'Enter blood bank name' : 'johndoe'}
              className={validationErrors.username ? 'error' : ''}
            />
            {validationErrors.username && <span className="error-text">{validationErrors.username}</span>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={validationErrors.email ? 'error' : ''}
            />
            {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              className={validationErrors.phone ? 'error' : ''}
            />
            {validationErrors.phone && <span className="error-text">{validationErrors.phone}</span>}
          </div>

          <div className="form-group">
            <label>City / Location</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York, NY"
                className={validationErrors.city ? 'error' : ''}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={detectLocation}
                className="btn-detect-location"
                style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
              >
                📍 Detect
              </button>
            </div>
            {validationErrors.city && <span className="error-text">{validationErrors.city}</span>}
            {formData.latitude && formData.longitude && (
              <small style={{ color: '#16a085', marginTop: '0.25rem', display: 'block' }}>
                ✓ Location detected ({formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)})
              </small>
            )}
          </div>

          {/* Conditional Blood Group Field - Show for donors AND recipients */}
          {(formData.userType === 'donor' || formData.userType === 'recipient') && (
            <div className="form-group full-width fade-in">
              <label>
                {formData.userType === 'donor' ? 'Blood Group' : 'Required Blood Group'}
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className={validationErrors.bloodGroup ? 'error form-select' : 'form-select'}
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
              {validationErrors.bloodGroup && <span className="error-text">{validationErrors.bloodGroup}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              className={validationErrors.password ? 'error' : ''}
            />
            {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••"
              className={validationErrors.confirmPassword ? 'error' : ''}
            />
            {validationErrors.confirmPassword && <span className="error-text">{validationErrors.confirmPassword}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-register" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </div>

          <p className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}