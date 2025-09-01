import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div style={{ textAlign: 'center' }}>
        <div className="loading-spinner" />
        <div className="loading-text">Loading images...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
