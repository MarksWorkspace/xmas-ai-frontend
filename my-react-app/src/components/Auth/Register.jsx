import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  // Check if all fields are filled out
  const isFormValid = () => {
    return username.trim() && 
           email.trim() && 
           phone.trim() && 
           companyName.trim() && 
           password.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password, phone, companyName);
      // After successful registration, redirect to login
      navigate('/login');
    } catch (err) {
      // Error is handled by AuthContext

    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +1 (555) 123-4567"
              required
              autoComplete="tel"
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., ABC Christmas Decorating"
              required
              autoComplete="organization"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
                     <button type="submit" disabled={loading || !isFormValid()}>
             {loading ? 'Registering...' : 'Register'}
           </button>
        </form>
        <p className="auth-switch">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')}>Login</button>
        </p>

      </div>
    </div>
  );
};

export default Register;