import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SearchSection from './pages/SearchSection';
import DonorDashboard from './pages/DonorDashboard';
import BloodBankDashboard from './pages/BloodBankDashboard';
import BloodStockPublic from './pages/BloodStockPublic';
import RecipientDashboard from './pages/RecipientDashboard';
import RoleRedirector from './components/RoleRedirector';
import './styles.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchSection />} />
            <Route path="/blood-stock" element={<BloodStockPublic />} />

            {/* Generic Dashboard Route - Redirects based on role */}
            <Route
              path="/dashboard"
              element={<RoleRedirector />}
            />

            {/* Role Specific Dashboards */}
            <Route
              path="/donor-dashboard"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bloodbank-dashboard"
              element={
                <ProtectedRoute allowedRoles={['bank']}>
                  <BloodBankDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recipient-dashboard"
              element={
                <ProtectedRoute allowedRoles={['recipient']}>
                  <RecipientDashboard />
                </ProtectedRoute>
              }
            />

          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
