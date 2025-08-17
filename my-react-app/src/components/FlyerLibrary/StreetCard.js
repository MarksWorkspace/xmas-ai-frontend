import React from 'react';
import './FlyerCard.css'; // Reuse existing card styling

const StreetCard = ({ streetName, houseCount, thumbnail, onClick }) => {
  return (
    <div className="flyer-card" onClick={onClick}>
      <div className="flyer-image">
        <img src={thumbnail} alt={`Houses on ${streetName}`} />
      </div>
      <div className="flyer-details">
        <h3 className="flyer-address">{streetName}</h3>
        <p className="house-count">{houseCount} houses</p>
      </div>
    </div>
  );
};

export default StreetCard;