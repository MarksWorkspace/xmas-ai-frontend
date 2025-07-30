import React from 'react';
import './FlyerLibrary.css';
import FlyerCard from './FlyerCard';

const FlyerLibrary = () => {
  // Sample data - will be replaced with API data later
  const flyers = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&h=600',
      address: '123 Oak Street'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?auto=format&fit=crop&w=800&h=600',
      address: '789 Elm Court'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&h=600',
      address: '456 Pine Ave'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&h=600',
      address: '4th Street Deluxe'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&h=600',
      address: '123 Oak Street'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&h=600',
      address: '789 Elm Court'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&h=600',
      address: '456 Pine Ave'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&h=600',
      address: '456 Pine Ave'
    }
  ];

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
        {flyers.map((flyer) => (
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