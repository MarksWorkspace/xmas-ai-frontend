import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './StatCard.css';

const FreeUsageCard = () => {
  const { freeUsage } = useAuth();

  if (!freeUsage) {
    return null;
  }

  const { free_images_remaining, free_images_used, total_free_images_granted } = freeUsage;

  // Don't show the card if user has used all free images
  if (free_images_remaining === 0) {
    return null;
  }

  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <h3>Free Images</h3>
        <div className="stat-numbers">
          <div className="stat-item">
            <span className="stat-value">{free_images_remaining}</span>
            <span className="stat-label">Remaining</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{free_images_used}</span>
            <span className="stat-label">Used</span>
          </div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(free_images_used / total_free_images_granted) * 100}%`,
              backgroundColor: '#4CAF50'
            }}
          />
        </div>
        <p className="stat-footer">
          {free_images_remaining} of {total_free_images_granted} free images remaining
        </p>
      </div>
    </div>
  );
};

export default FreeUsageCard;
