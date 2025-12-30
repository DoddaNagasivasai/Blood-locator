// frontend/src/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const API_URL = "http://localhost:5000/api";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!form.username.trim()) {
      setError("Username or email is required");
      setLoading(false);
      return;
    }

    if (!form.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Login failed");
      }

      // Update global auth state immediately (which handles localStorage)
      login(data.user, data.access_token);

      console.log("✅ Login successful:", data.user.username);

      // Redirect to Dashboard (which handles role redirection)
      navigate("/dashboard");

    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>🩸 Blood Locator</h2>
          <p>Welcome back! Please login to your account.</p>
        </div>

        {error && (
          <div className="error-banner">❌ {error}</div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username or email"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
              className={error && error.includes("Username") ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
              className={error && error.includes("Password") ? 'error' : ''}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-login">
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="register-link">
            Don't have an account?{" "}
            <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
