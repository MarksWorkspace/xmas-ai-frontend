import React from 'react';
import './WelcomeBanner.css';
import StatCard from '../StatCard/StatCard';
import { FiPlus } from 'react-icons/fi';

const WelcomeBanner = () => {
  // This will eventually come from an API/props
  const statsData = [
    {
      icon: "neighborhoods",
      value: "12",
      label: "Neighborhoods Targeted"
    },
    {
      icon: "jobs",
      value: "5",
      label: "Batch Jobs in Progress"
    },
    {
      icon: "flyers",
      value: "247",
      label: "Flyers Generated This Week"
    },
    {
      icon: "conversion",
      value: "4.8%",
      label: "Conversion CTR"
    }
  ];

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
      <div className="stats-container">
        {statsData.map((stat, index) => (
          <StatCard 
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomeBanner; 