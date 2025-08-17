import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FlyerLibrary.css';
import FlyerCard from './FlyerCard';
import { useJobs } from '../../context/JobContext';
import { makeRequest, API_ROUTES, API_BASE_URL } from '../../config/api';
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
    console.log('Download clicked:', { flyerId, jobId, addressId });
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/addresses/${addressId}/output-image`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to download image');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `flyer-${addressId}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
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