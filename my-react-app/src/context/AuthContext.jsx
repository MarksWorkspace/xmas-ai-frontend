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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await makeRequest(API_ROUTES.login, 'POST', {
        username,
        password,
        grant_type: 'password',
      }, true); // Set isFormEncoded to true for login
      setUser({ username, token: response.access_token });
      localStorage.setItem('auth_token', response.access_token);
      return response;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await makeRequest(API_ROUTES.register, 'POST', {
        username,
        email,
        password,
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
    localStorage.removeItem('auth_token');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};