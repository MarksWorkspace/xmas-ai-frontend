import React, { useState, useEffect } from 'react';
import './WelcomeBanner.css';
import { makeRequest, API_ROUTES } from '../../config/api';

const WelcomeBanner = () => {
  const [username, setUsername] = useState(() => {
    // Try to get username from sessionStorage on initial render
    return sessionStorage.getItem('username') || '';
  });

  useEffect(() => {
    // Only fetch if we don't have a username in sessionStorage
    if (!sessionStorage.getItem('username')) {
      const fetchUsername = async () => {
        try {
          const response = await makeRequest(API_ROUTES.me, 'GET');
          if (response && response.username) {
            setUsername(response.username);
            // Cache the username in sessionStorage
            sessionStorage.setItem('username', response.username);
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      };

      fetchUsername();
    }
  }, []);

  return (
    <div className="welcome-section">
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>Welcome back, {username || 'User'}</h1>
          <p>Transform neighborhoods into winter wonderlands with AI-enhanced marketing</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner; 