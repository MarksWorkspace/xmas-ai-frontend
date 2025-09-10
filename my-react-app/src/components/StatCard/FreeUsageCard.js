import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './StatCard.css';

const FreeUsageCard = () => {
  const { freeUsage } = useAuth();

  // First check if user has subscription data
  const hasSubscription = freeUsage?.has_subscription;

  // Don't show the card if user has a subscription
  if (hasSubscription) {
    return null;
  }

  // Show loading state if no freeUsage data
  if (!freeUsage) {
    return (
      <div className="stat-card">
        <div className="stat-card-content">
          <h3>Free Images</h3>
          <div className="stat-numbers">
            <div className="stat-item">
              <span className="stat-value">...</span>
              <span className="stat-label">Loading</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { free_images_remaining, free_images_used, total_free_images_granted } = freeUsage;

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
              backgroundColor: free_images_remaining === 0 ? '#dc3545' : '#4CAF50'
            }}
          />
        </div>
        <p className="stat-footer">
          {free_images_remaining === 0 ? (
            <span style={{ color: '#dc3545' }}>
              No free images remaining. Subscribe to continue creating images.
            </span>
          ) : (
            `${free_images_remaining} of ${total_free_images_granted} free images remaining`
          )}
        </p>
      </div>
    </div>
  );
};

export default FreeUsageCard;