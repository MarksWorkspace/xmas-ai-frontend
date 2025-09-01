import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { makeRequest, API_ROUTES, API_BASE_URL } from '../../config/api';
import AuthImage from '../common/AuthImage';
import ImageModal from '../common/ImageModal';
import LoadingOverlay from './LoadingOverlay';
import './StreetView.css';
import JSZip from 'jszip';

const StreetView = () => {
  const { streetName } = useParams();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(20);
  const [selectedImage, setSelectedImage] = useState(null);
  const ITEMS_PER_PAGE = 20;

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
      const token = localStorage.getItem('auth_token');
      console.log('Download params:', { jobId, addressId });
      const downloadUrl = `${API_BASE_URL}/jobs/${jobId}/addresses/${addressId}/output-image`;
      console.log('Downloading from:', downloadUrl);
      const response = await fetch(downloadUrl, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `flyer-${addressId}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [isPngDownloading, setIsPngDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const downloadImage = async (imageUrl) => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}${imageUrl}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'image/jpeg, image/png, image/*'
      }
    });
    if (!response.ok) throw new Error(`Failed to download image: ${response.status}`);
    const blob = await response.blob();
    // Ensure we're creating a proper image blob
    return new Blob([blob], { type: 'image/jpeg' });
  };

  const handleDownloadFlyers = async (type) => {
    const setLoading = type === 'pdf' ? setIsPdfDownloading : setIsPngDownloading;
    setLoading(true);
    setDownloadError(null);

    try {
      if (!houses.length || !houses[0].jobId) {
        throw new Error('No job ID available');
      }

      const jobId = houses[0].jobId;
      const token = localStorage.getItem('auth_token');

      // First, get the list of flyer files
      const filesResponse = await fetch(`${API_BASE_URL}/jobs/${jobId}/fliers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!filesResponse.ok) {
        throw new Error(`Failed to get flyer list: ${filesResponse.status}`);
      }

      const filesData = await filesResponse.json();
      const fileToDownload = filesData.fliers.find(f => 
        type === 'pdf' ? f.type === 'pdf' : f.type === 'zip'
      );

      if (!fileToDownload) {
        throw new Error(`No ${type.toUpperCase()} file available`);
      }

      // Now download the actual file
      const downloadResponse = await fetch(
        `${API_BASE_URL}/jobs/${jobId}/fliers/${fileToDownload.filename}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!downloadResponse.ok) {
        throw new Error(`Failed to download file: ${downloadResponse.status}`);
      }

      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileToDownload.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error downloading ${type} flyers:`, error);
      setDownloadError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (houses.length > 0) {
      const jobId = houses[0].jobId;
      setIsDownloading(true);
      setDownloadError(null);
      
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(API_ROUTES.jobDownloadAll(jobId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          throw new Error(`Failed to download images: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Extract all output image URLs and addresses
        const imagesToDownload = data.images
          .filter(img => img.output_image_exists)
          .map(img => ({
            url: img.output_image_url,
            address: img.street ? `${img.house_number} ${img.street}` : `house-${img.address_id}`
          }));

        if (imagesToDownload.length === 0) {
          throw new Error('No completed images available for download');
        }

        // Download all images
        const blobs = await Promise.all(imagesToDownload.map(img => downloadImage(img.url)));
        
        // Create a zip file containing all images
        const zip = new JSZip();
        imagesToDownload.forEach((img, index) => {
          // Use address as filename, sanitize it for file system
          const safeAddress = img.address.replace(/[^a-z0-9]/gi, '-').toLowerCase();
          const filename = `${safeAddress}.jpg`;
          zip.file(filename, blobs[index], { binary: true });
        });

        // Generate and download the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const blobUrl = window.URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${streetName}-all.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Error downloading all images:', error);
        setDownloadError(error.message);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // Add a slight delay before removing the loading overlay
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (error) {
    return <div className="street-view-error">{error}</div>;
  }

  return (
    <div>
      {loading && <LoadingOverlay />}
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
        <div className="download-all-container">
          <button 
            className="download-button" 
            onClick={handleDownloadAll}
            disabled={isDownloading || isPdfDownloading || isPngDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download All Images'}
          </button>
          <button 
            className="download-button" 
            onClick={() => handleDownloadFlyers('pdf')}
            disabled={isDownloading || isPdfDownloading || isPngDownloading}
          >
            {isPdfDownloading ? 'Downloading...' : 'Download PDF Flyers'}
          </button>
          <button 
            className="download-button" 
            onClick={() => handleDownloadFlyers('png')}
            disabled={isDownloading || isPdfDownloading || isPngDownloading}
          >
            {isPngDownloading ? 'Downloading...' : 'Download PNG Flyers'}
          </button>
          {downloadError && <div className="download-error">{downloadError}</div>}
        </div>
      </div>

      <div className="houses-grid">
        {houses.slice(0, displayLimit).map((house) => (
          <div key={house.id} className="house-card">
            <div className="house-image">
              <AuthImage src={house.image} alt={house.fullAddress} />
            </div>
            <div className="house-details">
              <h3>{house.fullAddress}</h3>
              <div className="house-actions">
                <button 
                  className="view-button"
                  onClick={() => setSelectedImage(house.image)}
                >
                  View
                </button>
                <button 
                  className="download-button"
                  onClick={() => {
                    // Get the original IDs from the house object
                    console.log('Download clicked - house data:', house);
                    // Extract addressId from the image URL since that has the full ID
                    const addressId = house.image.split('/addresses/')[1].split('/output-image')[0];
                    handleDownload(house.jobId, addressId);
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {houses.length > displayLimit && (
        <div className="show-more-container">
          <button 
            className="show-more-button"
            onClick={() => setDisplayLimit(prev => prev + ITEMS_PER_PAGE)}
          >
            Show More
          </button>
        </div>
      )}

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      </div>
    </div>
  );
};

export default StreetView;