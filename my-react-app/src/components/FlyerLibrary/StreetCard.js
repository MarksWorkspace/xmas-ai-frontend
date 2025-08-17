import React from 'react';
import './FlyerCard.css'; // Reuse existing card styling

const StreetCard = ({ streetName, houseCount, thumbnail }) => {
  return (
    <div className="flyer-card">
      <div className="flyer-image">
        <img src={thumbnail} alt={`Houses on ${streetName}`} />
      </div>
      <div className="flyer-details">
        <h3 className="flyer-address">{streetName}</h3>
        <div className="street-card-footer">
          <p className="house-count">{houseCount} houses</p>
          <button 
            className="view-street-btn"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/street/${encodeURIComponent(streetName)}`;
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreetCard;