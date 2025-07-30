import React, { useState } from 'react';
import './CreateCampaign.css';
import { FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';

const CreateCampaign = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'address', 'map'
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "text/csv") {
      setFile(droppedFile);
      // Handle file upload
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === "text/csv") {
      setFile(selectedFile);
      // Handle file upload
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    // Handle address submission
    console.log({ address, city, zipCode });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'address':
        return (
          <div className="address-form-container">
            <form onSubmit={handleAddressSubmit} className="address-form">
              <div className="form-group">
                <label htmlFor="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter ZIP code"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn">
                Submit Address
              </button>
            </form>
          </div>
        );
      case 'upload':
        return (
          <div 
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-content">
              <IoCloudUploadOutline className="upload-icon" />
              <h2>Upload CSV File</h2>
              <p>Drag and drop your CSV file here, or click to browse</p>
              <input
                type="file"
                id="file-upload"
                accept=".csv"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button 
                className="choose-file-btn"
                onClick={() => document.getElementById('file-upload').click()}
              >
                Choose File
              </button>
              <p className="file-format-note">
                CSV should include columns: Address, City, ZIP Code
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-campaign-container">
      <div className="campaign-header">
        <FaHome className="header-icon" />
        <h1>Neighborhood / Address Selection</h1>
      </div>
      <p className="header-subtitle">
        Search, map, or upload addresses to generate marketing flyers
      </p>

      <div className="selection-options">
        <button className="option-button">
          <FaMapMarkerAlt className="option-icon" />
          Map Link
        </button>
        <button 
          className={`option-button ${activeTab === 'address' ? 'active' : ''}`}
          onClick={() => setActiveTab('address')}
        >
          <FaMapMarkerAlt className="option-icon" />
          Enter Address
        </button>
        <button 
          className={`option-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <IoCloudUploadOutline className="option-icon" />
          Upload CSV
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default CreateCampaign;