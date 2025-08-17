import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthImage from '../common/AuthImage';
import './BatchView.css';

const BatchView = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const flyers = window.__FLYER_DATA__?.completedFlyers || {};
  
  // Combine all flyers from all streets
  const allFlyers = Object.values(flyers).flat();
  const allStreets = Object.keys(flyers);

  return (
    <div className="batch-view">
      <div className="batch-view-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Library
        </button>
        <h1>{allStreets.join(' + ')}</h1>
        <p className="house-count">{allFlyers.length} houses</p>
      </div>
      
      <div className="flyers-grid">
        {allFlyers.map((flyer) => (
          <div key={flyer.id} className="flyer-item">
            <AuthImage src={flyer.image} alt={`House at ${flyer.fullAddress}`} />
            <div className="flyer-info">
              <p className="address">{flyer.fullAddress}</p>
              <div className="flyer-actions">
                <button className="share-btn">Share</button>
                <button className="download-btn">Download</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchView;