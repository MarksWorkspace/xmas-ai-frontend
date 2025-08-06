// API configuration
const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
    // Get the token from localStorage or wherever you store it
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const API_ENDPOINTS = {
    BASE_URL: API_CONFIG.BASE_URL,
    JOBS: `${API_CONFIG.BASE_URL}/jobs`,
    LOGIN: `${API_CONFIG.BASE_URL}/users/token`,
    REGISTER: `${API_CONFIG.BASE_URL}/users/register`,
    TOKEN: `${API_CONFIG.BASE_URL}/users/token`
};

export default API_CONFIG;