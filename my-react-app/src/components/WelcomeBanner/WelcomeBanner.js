import React from 'react';
import './WelcomeBanner.css';
import { FiPlus } from 'react-icons/fi';

const WelcomeBanner = () => {
  return (
    <div className="welcome-section">
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>Welcome back, Premium Installer</h1>
          <p>Transform neighborhoods into winter wonderlands with AI-enhanced marketing</p>
        </div>
        <button className="new-neighborhood-btn">
          <FiPlus size={16} />
          New Neighborhood
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner; 