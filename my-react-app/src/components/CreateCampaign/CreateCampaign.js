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
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');
  const [lightingPreferences, setLightingPreferences] = useState({});

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

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: `Generate image for ${address}, ${city}, ${state}`,
          addresses: [{
            street: address,
            city: city,
            state: state,
            county: county
          }],
          lighting_preferences: lightingPreferences
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      const data = await response.json();
      console.log('Job created:', data);
      // TODO: Handle successful job creation (e.g., show success message, redirect to job status page)
    } catch (error) {
      console.error('Error creating job:', error);
      // TODO: Handle error (e.g., show error message to user)
    }
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
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="county">County</label>
                  <input
                    type="text"
                    id="county"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    placeholder="Enter county"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="lighting">Lighting Preferences</label>
                <div className="lighting-options">
                  <button
                    type="button"
                    className={`lighting-btn ${lightingPreferences.daytime ? 'active' : ''}`}
                    onClick={() => setLightingPreferences(prev => ({...prev, daytime: !prev.daytime}))}
                  >
                    Daytime
                  </button>
                  <button
                    type="button"
                    className={`lighting-btn ${lightingPreferences.sunset ? 'active' : ''}`}
                    onClick={() => setLightingPreferences(prev => ({...prev, sunset: !prev.sunset}))}
                  >
                    Sunset
                  </button>
                  <button
                    type="button"
                    className={`lighting-btn ${lightingPreferences.night ? 'active' : ''}`}
                    onClick={() => setLightingPreferences(prev => ({...prev, night: !prev.night}))}
                  >
                    Night
                  </button>
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