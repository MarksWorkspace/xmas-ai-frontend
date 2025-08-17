import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FlyerLibrary.css';
import FlyerCard from './FlyerCard';
import { useJobs } from '../../context/JobContext';
import { makeRequest, API_ROUTES } from '../../config/api';
import AuthImage from '../common/AuthImage';

const FlyerLibrary = () => {
  const navigate = useNavigate();
  const { completedFlyers } = useJobs();
  
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
          <div key={street} className="flyer-card">
            <div className="flyer-image">
              <AuthImage src={flyers[0]?.image} alt={`Houses on ${street}`} />
            </div>
            <div className="flyer-details">
              <h3 className="flyer-address">{street}</h3>
              <div className="street-card-footer">
                <p className="house-count">{flyers.length} houses</p>
                <button 
                  className="view-street-btn"
                  onClick={() => {
                    // Store the flyer data in window for the street view
                    window.__FLYER_DATA__ = { completedFlyers };
                    navigate(`/street/${encodeURIComponent(street)}`);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
        {Object.keys(completedFlyers).length === 0 && (
          <div className="no-flyers-message">No completed flyers yet</div>
        )}
      </div>
    </div>
  );
};

export default FlyerLibrary; 