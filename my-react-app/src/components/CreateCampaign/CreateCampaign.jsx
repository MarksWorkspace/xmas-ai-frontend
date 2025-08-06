import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CreateCampaign.css';
import { FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { API_ROUTES, makeRequest } from '../../config/api';

// Custom hook for form handling
const useAddressForm = (onSubmit) => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    county: '',
  });

  const [lightingPreferences, setLightingPreferences] = useState({
    daytime: false,
    sunset: false,
    night: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleLightingPreference = (preference) => {
    setLightingPreferences((prev) => ({
      ...prev,
      [preference]: !prev[preference],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit({ ...formData, lightingPreferences });
  };

  return {
    formData,
    lightingPreferences,
    handleInputChange,
    toggleLightingPreference,
    handleSubmit,
  };
};

// Form Input Component
const FormInput = ({ label, id, value, onChange, placeholder, required }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

// Lighting Preferences Component
const LightingPreferences = ({ preferences, onToggle }) => (
  <div className="form-group">
    <label htmlFor="lighting">Lighting Preferences</label>
    <div className="lighting-options">
      {Object.entries(preferences).map(([key, value]) => (
        <button
          key={key}
          type="button"
          className={`lighting-btn ${value ? 'active' : ''}`}
          onClick={() => onToggle(key)}
        >
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </button>
      ))}
    </div>
  </div>
);

LightingPreferences.propTypes = {
  preferences: PropTypes.shape({
    daytime: PropTypes.bool,
    sunset: PropTypes.bool,
    night: PropTypes.bool,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
};

// File Upload Component
const FileUpload = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

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
      onFileSelect(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === "text/csv") {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

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
        {file && <p className="file-selected">Selected: {file.name}</p>}
        <p className="file-format-note">
          CSV should include columns: Address, City, State, County
        </p>
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
};

// Main Component
const CreateCampaign = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);

  // Check if backend is available
  React.useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        await makeRequest(`${API_ROUTES.jobs}/status`, 'GET');
        setIsBackendAvailable(true);
      } catch (err) {
        console.error('Backend connection error:', err);
        setIsBackendAvailable(false);
        setError('Cannot connect to server. Please try again later.');
      }
    };

    checkBackendStatus();
  }, []);

  const handleAddressSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await makeRequest(API_ROUTES.jobs, 'POST', {
        description: `Generate image for ${formData.address}, ${formData.city}, ${formData.state}`,
        addresses: [{
          street: formData.address,
          city: formData.city,
          state: formData.state,
          county: formData.county
        }],
        lighting_preferences: formData.lightingPreferences
      });
      setSuccess('Job created successfully!');
      console.log('Job created:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error creating job:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file) => {
    // Handle file upload logic here
    console.log('File selected:', file);
  };

  const {
    formData,
    lightingPreferences,
    handleInputChange,
    toggleLightingPreference,
    handleSubmit,
  } = useAddressForm(handleAddressSubmit);

  const renderAddressForm = () => (
    <div className="address-form-container">
      <form onSubmit={handleSubmit} className="address-form">
        <FormInput
          label="Street Address"
          id="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter street address"
          required
        />
        <div className="form-row">
          <FormInput
            label="City"
            id="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter city"
            required
          />
          <FormInput
            label="State"
            id="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="Enter state"
            required
          />
        </div>
        <div className="form-row">
          <FormInput
            label="County"
            id="county"
            value={formData.county}
            onChange={handleInputChange}
            placeholder="Enter county"
            required
          />
        </div>
        <LightingPreferences
          preferences={lightingPreferences}
          onToggle={toggleLightingPreference}
        />
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isLoading || !isBackendAvailable}
        >
          {isLoading ? 'Submitting...' : 
           !isBackendAvailable ? 'Server Unavailable' : 
           'Submit Address'}
        </button>
      </form>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'address':
        return renderAddressForm();
      case 'upload':
        return <FileUpload onFileSelect={handleFileUpload} />;
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