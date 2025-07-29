import React from 'react';
import './FlyerLibrary.css';
import FlyerCard from './FlyerCard';

// Temporary hardcoded data - will be replaced with API data later
const sampleFlyers = [
  {
    id: 1,
    image: '/images/flyers/house1.jpg',
    address: '123 Oak Street',
  },
  {
    id: 2,
    image: '/images/flyers/house2.jpg',
    address: '789 Elm Court',
  },
  {
    id: 3,
    image: '/images/flyers/house3.jpg',
    address: '456 Pine Ave',
  },
  {
    id: 4,
    image: '/images/flyers/house4.jpg',
    address: '4th Street Deluxe',
  },
  {
    id: 5,
    image: '/images/flyers/house5.jpg',
    address: '123 Oak Street',
  },
  {
    id: 6,
    image: '/images/flyers/house6.jpg',
    address: '789 Elm Court',
  },
  {
    id: 7,
    image: '/images/flyers/house7.jpg',
    address: '456 Pine Ave',
  },
  {
    id: 8,
    image: '/images/flyers/house8.jpg',
    address: '456 Pine Ave',
  },
];

const FlyerLibrary = () => {
  const handleShare = (flyerId) => {
    // Will be implemented with actual sharing functionality
    console.log('Share flyer:', flyerId);
  };

  const handleDownload = (flyerId) => {
    // Will be implemented with actual download functionality
    console.log('Download flyer:', flyerId);
  };

  return (
    <div className="flyer-library">
      <div className="flyer-library-header">
        <div className="flyer-library-title">
          <i className="icon-flyer"></i>
          <h2>Flyer Library</h2>
        </div>
        <div className="branding-notice">
          <span>Your branding is live on all flyers</span>
          <button className="edit-branding-btn">Edit Branding</button>
        </div>
      </div>
      <div className="flyer-grid">
        {sampleFlyers.map((flyer) => (
          <FlyerCard
            key={flyer.id}
            image={flyer.image}
            address={flyer.address}
            onShare={() => handleShare(flyer.id)}
            onDownload={() => handleDownload(flyer.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FlyerLibrary; 