import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeRequest, API_ROUTES } from '../../config/api';
import AuthImage from '../common/AuthImage';
import './StreetView.css';

const StreetView = () => {
  const { streetName } = useParams();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStreetHouses = async () => {
      try {
        // Get houses from completedFlyers context for this street
        const { completedFlyers } = window.__FLYER_DATA__ || {};
        console.log('DEBUG - Street name:', streetName);
        console.log('DEBUG - Completed flyers data:', completedFlyers);
        if (completedFlyers && completedFlyers[streetName]) {
          console.log('DEBUG - Houses for this street:', completedFlyers[streetName].map(house => ({
            id: house.id,
            jobId: house.jobId,
            fullAddress: house.fullAddress,
            imageUrl: house.image.split('?')[0]
          })));
          setHouses(completedFlyers[streetName]);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading street data:', err);
        setError('Failed to load street data');
        setLoading(false);
      }
    };

    loadStreetHouses();
  }, [streetName]);

  const handleDownload = async (jobId, addressId) => {
    try {
      const downloadUrl = await makeRequest(API_ROUTES.jobDownloadAll(jobId), 'GET');
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `flyer-${addressId}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleDownloadAll = async () => {
    if (houses.length > 0) {
      const jobId = houses[0].jobId; // All houses in a street should be from the same job
      try {
        const downloadUrl = await makeRequest(API_ROUTES.jobDownloadAll(jobId), 'GET');
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${streetName}-all.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading all images:', error);
      }
    }
  };

  if (loading) {
    return <div className="street-view-loading">Loading...</div>;
  }

  if (error) {
    return <div className="street-view-error">{error}</div>;
  }

  return (
    <div className="street-view">
      <div className="street-view-header">
        <div className="header-left">
          <button className="back-button" onClick={() => window.history.back()}>
            ← Go Back
          </button>
          <div className="street-info">
            <h1>{streetName} - Dec 2025</h1>
            <p>{houses.length} houses rendered</p>
          </div>
        </div>
        <button className="download-all-button" onClick={handleDownloadAll}>
          Download All
        </button>
      </div>

      <div className="houses-grid">
        {houses.map((house) => (
          <div key={house.id} className="house-card">
            <div className="house-image">
              <AuthImage src={house.image} alt={house.fullAddress} />
            </div>
            <div className="house-details">
              <h3>{house.fullAddress}</h3>
              <div className="house-actions">
                <button className="view-button">View</button>
                <button 
                  className="download-button"
                  onClick={() => handleDownload(house.jobId, house.id)}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreetView;