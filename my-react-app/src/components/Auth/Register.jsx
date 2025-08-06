import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import './Auth.css';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration error:', errorData);
        
        // Handle specific error messages
        if (errorData.message) {
          if (errorData.message === 'an email already registered') {
            throw new Error('This email is already registered. Please try logging in instead.');
          }
          throw new Error(errorData.message);
        }
        
        // Handle validation errors array
        if (errorData.detail && Array.isArray(errorData.detail)) {
          const errorMessages = errorData.detail.map(err => err.msg || err.message || JSON.stringify(err)).join(', ');
          throw new Error(errorMessages);
        }
        
        throw new Error('Registration failed. Please try again.');
      }

      // If registration is successful, proceed with automatic login
      const loginResponse = await fetch(`${API_ENDPOINTS.BASE_URL}/users/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      if (!loginResponse.ok) {
        const loginErrorData = await loginResponse.json();
        console.error('Login error after registration:', loginErrorData);
        throw new Error(
          loginErrorData.detail || 
          'Registration successful but login failed. Please try logging in manually.'
        );
      }

      const loginData = await loginResponse.json();
      // Store the token - adjust this based on your backend's response format
      localStorage.setItem('token', loginData.token || loginData.access_token);
      localStorage.setItem('token_type', 'Bearer');
      onRegisterSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Choose a password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;