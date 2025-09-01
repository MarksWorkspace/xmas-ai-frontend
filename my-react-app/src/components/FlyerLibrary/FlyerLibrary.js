import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FlyerLibrary.css';
import FlyerCard from './FlyerCard';
import { useJobs } from '../../context/JobContext';
import { makeRequest, API_ROUTES, API_BASE_URL } from '../../config/api';
import AuthImage from '../common/AuthImage';

const FlyerLibrary = () => {
  const navigate = useNavigate();
  const { completedFlyers, sortedJobIds } = useJobs();

  // Format the date to be more readable and in local time
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Parse the UTC date string and explicitly handle timezone conversion
    const utcDate = new Date(dateString);
    
    // Get user's timezone offset in minutes
    const timezoneOffset = utcDate.getTimezoneOffset();
    
    // Create a new date adjusted for the local timezone
    const localDate = new Date(utcDate.getTime() - (timezoneOffset * 60000));
    
    return localDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
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
          <span className="icon-completed">✅</span>
          <h2>Completed Jobs</h2>
        </div>
        
      </div>
      <div className="flyer-grid">
        {sortedJobIds.map(jobId => {
          const jobData = completedFlyers[jobId];
          // Combine all flyers from all streets in this batch
          const allStreets = Object.keys(jobData.streets);
          const totalHouses = Object.values(jobData.streets).reduce((sum, flyers) => sum + flyers.length, 0);
          const firstImage = Object.values(jobData.streets)[0]?.[0]?.image;
          
          return (
            <div key={jobId} className="flyer-card">
              <div className="flyer-image">
                <AuthImage src={firstImage} alt={`Houses from ${jobData.title}`} />
              </div>
              <div className="flyer-details">
                <h3 className="flyer-title">{jobData.title}</h3>
                <p className="flyer-subtitle">{allStreets.join(' + ')}</p>
                {jobData.completedAt && (
                  <p className="completion-date">
                    Completed: {formatDate(jobData.completedAt)}
                  </p>
                )}
                <div className="street-card-footer">
                  <p className="house-count">{totalHouses} houses</p>
                  <button 
                    className="view-street-btn"
                    onClick={() => {
                      // Combine all flyers from all streets into a single list
                      const allFlyers = Object.values(jobData.streets).flat();
                      const combinedStreetName = allStreets.join(' + ');
                      
                      // Store the data in the expected format
                      window.__FLYER_DATA__ = { 
                        completedFlyers: {
                          [combinedStreetName]: allFlyers
                        }
                      };
                      navigate(`/street/${encodeURIComponent(combinedStreetName)}?batch=${jobId}`);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {Object.keys(completedFlyers).length === 0 && (
          <div className="no-flyers-message">No completed flyers yet</div>
        )}
      </div>
    </div>
  );
};

export default FlyerLibrary; 