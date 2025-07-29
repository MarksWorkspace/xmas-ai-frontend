import React from 'react';
import './StatCard.css';
import { HiOutlineHome } from 'react-icons/hi';
import { RiFlashlightLine } from 'react-icons/ri';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { HiOutlineChartBar } from 'react-icons/hi';

const StatCard = ({ icon, value, label }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'neighborhoods':
        return (
          <div className="stat-icon neighborhoods">
            <HiOutlineHome size={16} />
          </div>
        );
      case 'jobs':
        return (
          <div className="stat-icon jobs">
            <RiFlashlightLine size={16} />
          </div>
        );
      case 'flyers':
        return (
          <div className="stat-icon flyers">
            <IoDocumentTextOutline size={16} />
          </div>
        );
      case 'conversion':
        return (
          <div className="stat-icon conversion">
            <HiOutlineChartBar size={16} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="stat-card">
      {getIcon(icon)}
      <div className="stat-info">
        <h2 className="stat-value">{value}</h2>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
};

export default StatCard; 