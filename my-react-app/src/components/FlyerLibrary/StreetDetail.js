import React from 'react';
import FlyerCard from './FlyerCard';

const StreetDetail = ({ street, flyers, onBack, onShare, onDownload }) => {
  return (
    <div className="flyer-library">
      <div className="flyer-library-header">
        <div className="flyer-library-title">
          <button className="back-btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2>{street}</h2>
        </div>
        <div className="branding-notice">
          <span>Your branding is live on all flyers</span>
          <button className="edit-branding-btn">Edit Branding</button>
        </div>
      </div>
      <div className="flyer-grid">
        {flyers.map((flyer) => (
          <FlyerCard
            key={flyer.id}
            image={flyer.image}
            address={flyer.fullAddress}
            onShare={() => onShare(flyer.id)}
            onDownload={() => onDownload(flyer.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StreetDetail;