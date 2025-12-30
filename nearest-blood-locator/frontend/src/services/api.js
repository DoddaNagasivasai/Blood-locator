// API Service - Handles all HTTP requests to the backend
// This file centralizes all API calls for easy maintenance

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// ============================================
// DONOR API CALLS
// ============================================

/**
 * Get all donors
 */
export const getAllDonors = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/donors`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching donors:', error);
        throw error;
    }
};

/**
 * Get donor by ID
 * @param {number} id - Donor ID
 */
export const getDonorById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/donors/${id}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching donor:', error);
        throw error;
    }
};

/**
 * Search donors by blood group and location
 * @param {string} bloodGroup - Blood group (e.g., 'A+', 'O-')
 * @param {string} location - Location/city
 */
export const searchDonors = async (bloodGroup, location) => {
    try {
        const params = new URLSearchParams();
        if (bloodGroup) params.append('bloodGroup', bloodGroup);
        if (location) params.append('location', location);

        const response = await fetch(`${API_BASE_URL}/donors/search?${params}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error searching donors:', error);
        throw error;
    }
};

/**
 * Get available donors only
 */
export const getAvailableDonors = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/donors/available`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching available donors:', error);
        throw error;
    }
};

// ============================================
// BLOOD BANK API CALLS
// ============================================

/**
 * Get all blood banks
 */
export const getAllBloodBanks = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/blood-banks`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching blood banks:', error);
        throw error;
    }
};

/**
 * Get blood bank by ID
 * @param {number} id - Blood bank ID
 */
export const getBloodBankById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blood-banks/${id}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching blood bank:', error);
        throw error;
    }
};

/**
 * Search blood banks by blood group and location
 * @param {string} bloodGroup - Blood group
 * @param {string} location - Location/city
 */
export const searchBloodBanks = async (bloodGroup, location) => {
    try {
        const params = new URLSearchParams();
        if (bloodGroup) params.append('bloodGroup', bloodGroup);
        if (location) params.append('location', location);

        const response = await fetch(`${API_BASE_URL}/blood-banks/search?${params}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error searching blood banks:', error);
        throw error;
    }
};

/**
 * Get 24x7 blood banks
 */
export const get24x7BloodBanks = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/blood-banks/24x7`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching 24x7 blood banks:', error);
        throw error;
    }
};

/**
 * Get blood banks by specific blood group
 * @param {string} bloodGroup - Blood group
 */
export const getBloodBanksByGroup = async (bloodGroup) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blood-banks/blood-group/${bloodGroup}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching blood banks by group:', error);
        throw error;
    }
};

// ============================================
// AUTHENTICATION API CALLS
// ============================================

/**
 * Register a new user
 * @param {Object} userData - User registration data
 */
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 */
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

/**
 * Get user profile
 * In production, include JWT token in Authorization header
 */
export const getProfile = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                // 'Authorization': `Bearer ${token}` // In production
            }
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

// Export all API functions
export default {
    // Donors
    getAllDonors,
    getDonorById,
    searchDonors,
    getAvailableDonors,

    // Blood Banks
    getAllBloodBanks,
    getBloodBankById,
    searchBloodBanks,
    get24x7BloodBanks,
    getBloodBanksByGroup,

    // Auth
    register,
    login,
    getProfile
};
