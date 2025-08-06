import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="app">
      <div className="header">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;