import React, { useState, useEffect } from 'react';
import './FlyerLibrary.css';
import FlyerCard from './FlyerCard';
import StreetCard from './StreetCard';
import StreetDetail from './StreetDetail';
import { useJobs } from '../../context/JobContext';
import { makeRequest, API_ROUTES } from '../../config/api';

const FlyerLibrary = () => {
  const { completedFlyers, activeJobs } = useJobs();
  const [selectedStreet, setSelectedStreet] = useState(null);
  
  console.log('FlyerLibrary - completedFlyers:', completedFlyers);
  console.log('FlyerLibrary - activeJobs:', activeJobs);
  
  // Log whenever completedFlyers changes
  useEffect(() => {
    console.log('CompletedFlyers updated:', completedFlyers);
  }, [completedFlyers]);

  const handleShare = async (flyerId) => {
    console.log('Share flyer:', flyerId);
    // Implement sharing functionality
  };

  const handleDownload = async (flyerId) => {
    const [jobId, addressId] = flyerId.split('-');
    try {
      // Get the download URL
      const downloadUrl = await makeRequest(API_ROUTES.jobDownloadAll(jobId), 'GET');
      console.log('Download URL:', downloadUrl);
      
      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `flyer-${jobId}-${addressId}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading flyer:', error);
    }
  };

  if (selectedStreet) {
    return (
      <StreetDetail
        street={selectedStreet}
        flyers={completedFlyers[selectedStreet]}
        onBack={() => setSelectedStreet(null)}
        onShare={handleShare}
        onDownload={handleDownload}
      />
    );
  }

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
        {Object.entries(completedFlyers).map(([street, flyers]) => (
          <StreetCard
            key={street}
            streetName={street}
            houseCount={flyers.length}
            thumbnail={flyers[0]?.image}
            onClick={() => setSelectedStreet(street)}
          />
        ))}
        {Object.keys(completedFlyers).length === 0 && (
          <div className="no-flyers-message">No completed flyers yet</div>
        )}
      </div>
    </div>
  );
};

export default FlyerLibrary; 