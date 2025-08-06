import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Login from './Login';
import Register from './Register';
import './Auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuthSuccess = (token) => {
    login(token);
    navigate('/');
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <>
          <Login onLoginSuccess={handleAuthSuccess} />
          <div className="auth-switch">
            Don't have an account?
            <button onClick={() => setIsLogin(false)}>
              Register
            </button>
          </div>
        </>
      ) : (
        <>
          <Register onRegisterSuccess={handleAuthSuccess} />
          <div className="auth-switch">
            Already have an account?
            <button onClick={() => setIsLogin(true)}>
              Login
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthPage;