import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CreateCampaign.css';
import { FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { API_ROUTES, makeRequest } from '../../config/api';

// Map of state names to abbreviations
const stateAbbreviations = {
  'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR', 'CALIFORNIA': 'CA',
  'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE', 'FLORIDA': 'FL', 'GEORGIA': 'GA',
  'HAWAII': 'HI', 'IDAHO': 'ID', 'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA',
  'KANSAS': 'KS', 'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME', 'MARYLAND': 'MD',
  'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS', 'MISSOURI': 'MO',
  'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV', 'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ',
  'NEW MEXICO': 'NM', 'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'OHIO': 'OH',
  'OKLAHOMA': 'OK', 'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
  'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT', 'VERMONT': 'VT',
  'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV', 'WISCONSIN': 'WI', 'WYOMING': 'WY'
};

// Custom hook for form handling
const useAddressForm = (onSubmit) => {

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
  });

  const [lightingPreferences, setLightingPreferences] = useState({
    lighting: {
      overall_theme: '',
      color_palette: [],
      brightness: '',
      effect: '',
      density: ''
    },
    scene: {
      view_angle: '',
      time_of_day: '',
      season: '',
      weather: '',
      snow_coverage: '',
      mood: '',
      style: ''
    },
    roof_lights: {
      enabled: false,
      bulb_size: '',
      colors: [],
      pattern: '',
      style: ''
    },
    window_lights: {
      enabled: false,
      color: '',
      style: '',
      interior_glow: false
    },
    doorway_lights: {
      enabled: false,
      style: '',
      colors: [],
      extra: ''
    },
    walkway_lights: {
      enabled: false,
      style: '',
      color: '',
      spacing: ''
    },
    bush_lights: {
      enabled: false,
      bulb_size: '',
      colors: [],
      wrap_style: '',
      density: ''
    },
    tree_lights: {
      enabled: false,
      bulb_size: '',
      colors: [],
      wrap_style: '',
      density: ''
    },
    garage_trim_lights: {
      enabled: false,
      colors: [],
      pattern: ''
    },
    ambient: {
      sky_color: '',
      ambient_light_color: '',
      ground_reflection: ''
    },
    camera: {
      lens: '',
      framing: '',
      depth_of_field: ''
    },
    image_settings: {
      resolution: '',
      format: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'state') {
      // Convert input to uppercase for matching
      const upperValue = value.toUpperCase();
      
      // Check if it's already a valid 2-letter abbreviation
      if (Object.values(stateAbbreviations).includes(upperValue)) {
        setFormData(prev => ({ ...prev, [name]: upperValue }));
        return;
      }
      
      // Check if it matches a state name and convert to abbreviation
      const matchingState = Object.keys(stateAbbreviations).find(
        stateName => stateName.startsWith(upperValue)
      );
      
      if (matchingState) {
        setFormData(prev => ({ ...prev, [name]: stateAbbreviations[matchingState] }));
      } else {
        setFormData(prev => ({ ...prev, [name]: upperValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleLightingPreference = (newPreferences) => {
    setLightingPreferences(newPreferences);
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
const LightingPreferences = ({ preferences, onToggle }) => {
  const handleChange = (section, field, value) => {
    onToggle({
      ...preferences,
      [section]: {
        ...preferences[section],
        [field]: value
      }
    });
  };

  const handleArrayChange = (section, field, value) => {
    const values = value.split(',').map(v => v.trim()).filter(v => v);
    onToggle({
      ...preferences,
      [section]: {
        ...preferences[section],
        [field]: values
      }
    });
  };

  const handleToggle = (section, enabled) => {
    onToggle({
      ...preferences,
      [section]: {
        ...preferences[section],
        enabled: enabled
      }
    });
  };

  return (
    <div className="form-group lighting-preferences">
      <label>Lighting Preferences (Optional)</label>
      
      <div className="preferences-section">
        <h3>Scene Settings</h3>
        <div className="form-row">
          <select 
            value={preferences.scene.time_of_day} 
            onChange={(e) => handleChange('scene', 'time_of_day', e.target.value)}
          >
            <option value="">Select Time of Day</option>
            <option value="dawn">Dawn</option>
            <option value="twilight">Twilight</option>
            <option value="dusk">Dusk</option>
            <option value="night">Night</option>
          </select>

          <select 
            value={preferences.scene.season} 
            onChange={(e) => handleChange('scene', 'season', e.target.value)}
          >
            <option value="">Select Season</option>
            <option value="winter">Winter</option>
            <option value="fall">Fall</option>
          </select>
        </div>

        <div className="form-row">
          <select 
            value={preferences.scene.weather} 
            onChange={(e) => handleChange('scene', 'weather', e.target.value)}
          >
            <option value="">Select Weather</option>
            <option value="clear">Clear</option>
            <option value="light snow">Light Snow</option>
            <option value="heavy snow">Heavy Snow</option>
            <option value="cloudy">Cloudy</option>
          </select>

          <select 
            value={preferences.scene.view_angle} 
            onChange={(e) => handleChange('scene', 'view_angle', e.target.value)}
          >
            <option value="">Select View Angle</option>
            <option value="straight on">Straight On</option>
            <option value="slightly elevated frontal">Slightly Elevated</option>
            <option value="elevated">Elevated</option>
          </select>
        </div>
      </div>

      <div className="preferences-section">
        <h3>General Lighting</h3>
        <div className="form-row">
          <select 
            value={preferences.lighting.overall_theme} 
            onChange={(e) => handleChange('lighting', 'overall_theme', e.target.value)}
          >
            <option value="">Select Theme</option>
            <option value="classic multicolor">Classic Multicolor</option>
            <option value="warm white">Warm White</option>
            <option value="cool white">Cool White</option>
            <option value="red and green">Red and Green</option>
          </select>

          <select 
            value={preferences.lighting.brightness} 
            onChange={(e) => handleChange('lighting', 'brightness', e.target.value)}
          >
            <option value="">Select Brightness</option>
            <option value="subtle">Subtle</option>
            <option value="balanced">Balanced</option>
            <option value="bright">Bright</option>
          </select>
        </div>

        <div className="form-row">
          <select 
            value={preferences.lighting.density} 
            onChange={(e) => handleChange('lighting', 'density', e.target.value)}
          >
            <option value="">Select Density</option>
            <option value="sparse">Sparse</option>
            <option value="moderate">Moderate</option>
            <option value="full">Full</option>
          </select>

          <select 
            value={preferences.lighting.effect} 
            onChange={(e) => handleChange('lighting', 'effect', e.target.value)}
          >
            <option value="">Select Effect</option>
            <option value="steady">Steady</option>
            <option value="twinkling">Twinkling</option>
            <option value="chasing">Chasing</option>
          </select>
        </div>
      </div>

      <div className="preferences-section">
        <h3>Roof Lights</h3>
        <div className="form-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={preferences.roof_lights.enabled}
              onChange={(e) => handleToggle('roof_lights', e.target.checked)}
            />
            Enable Roof Lights
          </label>
        </div>

        {preferences.roof_lights.enabled && (
          <>
            <div className="form-row">
              <select 
                value={preferences.roof_lights.bulb_size} 
                onChange={(e) => handleChange('roof_lights', 'bulb_size', e.target.value)}
              >
                <option value="">Select Bulb Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>

              <select 
                value={preferences.roof_lights.style} 
                onChange={(e) => handleChange('roof_lights', 'style', e.target.value)}
              >
                <option value="">Select Style</option>
                <option value="C9 bulbs">C9 Bulbs</option>
                <option value="mini lights">Mini Lights</option>
                <option value="icicle lights">Icicle Lights</option>
              </select>
            </div>

            <div className="form-row">
              <input
                type="text"
                placeholder="Colors (comma-separated)"
                value={preferences.roof_lights.colors.join(', ')}
                onChange={(e) => handleArrayChange('roof_lights', 'colors', e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="preferences-section">
        <h3>Window Lights</h3>
        <div className="form-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={preferences.window_lights.enabled}
              onChange={(e) => handleToggle('window_lights', e.target.checked)}
            />
            Enable Window Lights
          </label>
        </div>

        {preferences.window_lights.enabled && (
          <>
            <div className="form-row">
              <select 
                value={preferences.window_lights.style} 
                onChange={(e) => handleChange('window_lights', 'style', e.target.value)}
              >
                <option value="">Select Style</option>
                <option value="candle lights in each window">Candle Lights</option>
                <option value="string lights">String Lights</option>
                <option value="icicle lights">Icicle Lights</option>
              </select>

              <select 
                value={preferences.window_lights.color} 
                onChange={(e) => handleChange('window_lights', 'color', e.target.value)}
              >
                <option value="">Select Color</option>
                <option value="warm white">Warm White</option>
                <option value="cool white">Cool White</option>
                <option value="multicolor">Multicolor</option>
              </select>
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={preferences.window_lights.interior_glow}
                  onChange={(e) => handleChange('window_lights', 'interior_glow', e.target.checked)}
                />
                Interior Glow
              </label>
            </div>
          </>
        )}
      </div>

      <div className="preferences-section">
        <h3>Image Settings</h3>
        <div className="form-row">
          <select 
            value={preferences.image_settings.resolution} 
            onChange={(e) => handleChange('image_settings', 'resolution', e.target.value)}
          >
            <option value="">Select Resolution</option>
            <option value="1920x1080">1920x1080 (Full HD)</option>
            <option value="2560x1440">2560x1440 (2K)</option>
            <option value="3840x2160">3840x2160 (4K)</option>
          </select>

          <select 
            value={preferences.image_settings.format} 
            onChange={(e) => handleChange('image_settings', 'format', e.target.value)}
          >
            <option value="">Select Format</option>
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
            <option value="square">Square</option>
          </select>
        </div>
      </div>
    </div>
  );
};

LightingPreferences.propTypes = {
  preferences: PropTypes.shape({
    scene: PropTypes.shape({
      style: PropTypes.string,
      time_of_day: PropTypes.string,
      weather: PropTypes.string,
      mood: PropTypes.string,
      season: PropTypes.string
    }),
    lighting: PropTypes.shape({
      overall_theme: PropTypes.string,
      brightness: PropTypes.string,
      effect: PropTypes.string,
      density: PropTypes.string,
      color_palette: PropTypes.arrayOf(PropTypes.string)
    })
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

  // Check if backend is available and user is authenticated
  React.useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        // Check if we have an auth token
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setIsBackendAvailable(false);
          setError('Please log in to continue.');
          return;
        }

        // Test the connection with authentication
        await makeRequest(API_ROUTES.jobs, 'GET');
        setIsBackendAvailable(true);
        setError(null);
      } catch (err) {
        console.error('Backend connection error:', err);
        setIsBackendAvailable(false);
        if (err.message.includes('401') || err.message.includes('unauthorized')) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Cannot connect to server. Please try again later.');
        }
      }
    };

    checkBackendStatus();
  }, []);

  const handleAddressSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Format the request data according to the API specification
      const requestData = {
        description: `Generate image for ${formData.address}, ${formData.city}, ${formData.state}`,
        addresses: [
          {
            street: formData.address,
            city: formData.city,
            state: formData.state
          }
        ]
      };

      // Only add lighting preferences if they are set
      // Helper function to clean empty values from an object
      const cleanObject = (obj) => {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value && (
            (Array.isArray(value) && value.length > 0) || 
            (typeof value === 'object' && Object.keys(cleanObject(value)).length > 0) ||
            (typeof value !== 'object' && value !== '')
          )) {
            cleaned[key] = typeof value === 'object' && !Array.isArray(value) 
              ? cleanObject(value) 
              : value;
          }
        }
        return cleaned;
      };

      // Only add lighting_preferences if there are actual preferences set
      if (formData.lightingPreferences) {
        const cleanedPreferences = cleanObject(formData.lightingPreferences);
        if (Object.keys(cleanedPreferences).length > 0) {
          requestData.lighting_preferences = cleanedPreferences;
        }
      }

      // Add debug logging to see the exact request format
      console.log('Request data structure:', JSON.stringify(requestData, null, 2));

      console.log('Sending request with data:', requestData); // Debug log
      const data = await makeRequest(API_ROUTES.jobs, 'POST', requestData);
      
      setSuccess('Campaign created successfully! Processing your request...');
      console.log('Job created:', data);
    } catch (err) {
      setError(err.message || 'Failed to create campaign. Please try again.');
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
          <div className="form-group">
            <label htmlFor="state">State</label>
            <select 
              className="ui search dropdown"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
            >
              <option value="">State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
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