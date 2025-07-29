import React from 'react';
import './FlyerCard.css';

const FlyerCard = ({ image, address, onShare, onDownload }) => {
  return (
    <div className="flyer-card">
      <div className="flyer-image">
        <img src={image} alt={`Flyer for ${address}`} />
      </div>
      <div className="flyer-details">
        <h3 className="flyer-address">{address}</h3>
        <div className="flyer-actions">
          <button className="action-btn share-btn" onClick={onShare}>
            Share
          </button>
          <button className="action-btn download-btn" onClick={onDownload}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlyerCard; 