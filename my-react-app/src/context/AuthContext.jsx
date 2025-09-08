import React, { createContext, useContext, useState } from 'react';
import { API_ROUTES, makeRequest } from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('auth_token');
    const username = localStorage.getItem('username');
    if (token && username) {
      return { username, token };
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [freeUsage, setFreeUsage] = useState(null);

  // Effect to fetch free usage data
  React.useEffect(() => {
    const fetchFreeUsage = async () => {
      try {
        const response = await makeRequest(API_ROUTES.freeUsage);
        setFreeUsage(response);
      } catch (err) {
        console.error('Error fetching free usage:', err);
      }
    };
    fetchFreeUsage();
  }, []);

  // Effect to sync user state with localStorage and handle initialization
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('auth_token', user.token);
      localStorage.setItem('username', user.username);
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
    }
    
    // Mark initialization as complete after first render
    if (isInitializing) {
      setIsInitializing(false);
    }
  }, [user, isInitializing]);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await makeRequest(API_ROUTES.login, 'POST', {
        username,
        password,
        grant_type: 'password',
      }, true); // Set isFormEncoded to true for login
      
      // Store token immediately in localStorage
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('username', username);
      
      // Then update state
      setUser({ username, token: response.access_token });
      
      // Force reload to ensure fresh data
      window.location.href = '/dashboard';
      return response;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, phone, company_name) => {
    try {
      setLoading(true);
      setError(null);
      const response = await makeRequest(API_ROUTES.register, 'POST', {
        username,
        email,
        password,
        phone,
        company_name,
      });
      return response;
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear all user-related data from localStorage and sessionStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    sessionStorage.removeItem('username');
    // Force reload the page to clear all cached data
    window.location.href = '/login';
  };

  const refreshFreeUsage = async () => {
    try {
      const response = await makeRequest(API_ROUTES.freeUsage);
      setFreeUsage(response);
      return response;
    } catch (err) {
      console.error('Error refreshing free usage:', err);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    isInitializing,
    error,
    freeUsage,
    refreshFreeUsage,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

};