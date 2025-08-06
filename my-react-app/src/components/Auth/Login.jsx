import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import './Auth.css';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
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
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/users/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password,
          grant_type: 'password',
          scope: '',
          client_id: '',
          client_secret: ''
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error:', errorData);
        
        if (errorData.detail) {
          throw new Error(errorData.detail);
        }
        
        throw new Error('Invalid username or password. Please try again.');
      }

      const data = await response.json();
      // Store the token - adjust this based on your backend's response format
      localStorage.setItem('token', data.token || data.access_token);
      localStorage.setItem('token_type', 'Bearer');
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;