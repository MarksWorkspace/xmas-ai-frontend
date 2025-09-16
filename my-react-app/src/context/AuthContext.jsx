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
  const [subscription, setSubscription] = useState(null);

  // Effect to fetch free usage and subscription data
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return; // Don't fetch if user is not logged in
      
      try {
        // Fetch both free usage and subscription data
        const [freeUsageResponse, subscriptionResponse] = await Promise.all([
          makeRequest(API_ROUTES.freeUsage),
          makeRequest(API_ROUTES.mySubscription)
        ]);
        
        if (freeUsageResponse) {
          setFreeUsage({
            ...freeUsageResponse,
            has_subscription: subscriptionResponse?.status === 'active' || false
          });
        }
        setSubscription(subscriptionResponse);
      } catch (err) {
        console.error('Error fetching user data:', err);
        // Set default values if there's an error
        setFreeUsage({
          free_images_remaining: 0,
          free_images_used: 0,
          total_free_images_granted: 0,
          has_subscription: false
        });
      }
    };
    fetchUserData();
  }, [user]); // Add user as dependency

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
      // Fetch both free usage and subscription data
      const [freeUsageResponse, subscriptionResponse] = await Promise.all([
        makeRequest(API_ROUTES.freeUsage),
        makeRequest(API_ROUTES.subscription)
      ]);
      
      setSubscription(subscriptionResponse);
      
      // If we get a null response, keep the default values
      if (freeUsageResponse) {
        setFreeUsage({
          ...freeUsageResponse,
          has_subscription: subscriptionResponse?.status === 'active' || false
        });
      }
      
      return freeUsageResponse;
    } catch (err) {
      console.error('Error refreshing user data:', err);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    isInitializing,
    error,
    freeUsage,
    subscription,
    refreshFreeUsage,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

};