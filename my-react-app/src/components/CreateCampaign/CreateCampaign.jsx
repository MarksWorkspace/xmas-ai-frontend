import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CreateCampaign.css';
import { FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Paper, 
  IconButton,
  Stack,
  Divider,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { API_ROUTES, makeRequest } from '../../config/api';
import LightingPreferences from './LightingPreferences';

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
    campaignName: '',
    city: '',
    state: '',
    addresses: ['']  // Array to hold multiple addresses
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

  const handleInputChange = (e, addressIndex) => {
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
    } else if (name === 'address') {
      // Update specific address in the addresses array
      setFormData(prev => ({
        ...prev,
        addresses: prev.addresses.map((addr, idx) => 
          idx === addressIndex ? value : addr
        )
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleLightingPreference = (newPreferences) => {
    setLightingPreferences(newPreferences);
  };

  const addAddressField = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, '']
    }));
  };

  const removeAddressField = (index) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, idx) => idx !== index)
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
    addAddressField,
    removeAddressField,
  };
};

// Form Input Component
const FormInput = ({ label, id, value, onChange, placeholder, required, select, children }) => (
  <TextField
    fullWidth
    variant="outlined"
    label={label}
    id={id}
    name={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    select={select}
    margin="normal"
    size="medium"
  >
    {children}
  </TextField>
);

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  select: PropTypes.bool,
  children: PropTypes.node,
};

// Main Component
const CreateCampaign = () => {
  const [activeTab, setActiveTab] = useState('address');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    campaignName: '',
    addresses: '',
    city: '',
    state: ''
  });
  const [success, setSuccess] = useState(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);

  // Check if backend is available and user is authenticated
  React.useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setIsBackendAvailable(false);
          setError('Please log in to continue.');
          return;
        }

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

  const validateForm = (formData) => {
    const errors = {};
    
    // Check campaign name
    if (!formData.campaignName.trim()) {
      errors.campaignName = 'Campaign name is required';
    }

    // Check if at least one address is entered
    if (!formData.addresses.some(addr => addr.trim())) {
      errors.addresses = 'At least one street address is required';
    }

    // Check city
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    // Check state
    if (!formData.state) {
      errors.state = 'State is required';
    }

    return errors;
  };

  const handleAddressSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    // Reset field errors
    setFieldErrors({
      campaignName: '',
      addresses: '',
      city: '',
      state: ''
    });

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const requestData = {
        description: formData.campaignName,
        addresses: formData.addresses.map(address => ({
          street: address,
          city: formData.city,
          state: formData.state
        }))
      };

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

      if (formData.lightingPreferences) {
        const cleanedPreferences = cleanObject(formData.lightingPreferences);
        if (Object.keys(cleanedPreferences).length > 0) {
          requestData.lighting_preferences = cleanedPreferences;
        }
      }

      const data = await makeRequest(API_ROUTES.jobs, 'POST', requestData);
      setSuccess('Campaign created successfully! Processing your request...');
    } catch (err) {
      setError(err.message || 'Failed to create campaign. Please try again.');
      console.error('Error creating job:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    formData,
    lightingPreferences,
    handleInputChange,
    toggleLightingPreference,
    handleSubmit,
    addAddressField,
    removeAddressField,
  } = useAddressForm(handleAddressSubmit);

  const renderAddressForm = () => (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', p: 3, bgcolor: 'white', borderRadius: 1 }}>
      <TextField
        fullWidth
        label="Campaign Name"
        id="campaignName"
        name="campaignName"
        value={formData.campaignName}
        onChange={handleInputChange}
        required
        variant="outlined"
        size="medium"
        error={!!fieldErrors.campaignName}
        helperText={fieldErrors.campaignName}
        sx={{ mb: 3 }}
      />
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" color="primary" sx={{ mr: 2, minWidth: 'fit-content' }}>Addresses</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={addAddressField}
            fullWidth
            sx={{ 
              textTransform: 'none',
              height: '40px',
              fontSize: '14px'
            }}
          >
            + ADD ADDRESS
          </Button>
        </Box>
        
        <Stack spacing={2}>
          {formData.addresses.map((address, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, minHeight: '56px' }}>
              <TextField
                fullWidth
                id="address"
                name="address"
                value={address}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Enter street address"
                required
                variant="outlined"
                size="medium"
                sx={{ flex: 1 }}
              />
              {formData.addresses.length > 1 && (
                <IconButton
                  onClick={() => removeAddressField(index)}
                  sx={{ 
                    color: '#dc3545',
                    width: '56px',
                    height: '56px'
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2, mb: 3 }}>
        <TextField
          label="City"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          required
          variant="outlined"
          size="medium"
          error={!!fieldErrors.city}
          helperText={fieldErrors.city}
          sx={{ minHeight: '56px' }}
        />
        <TextField
          select
          label="State"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          required
          variant="outlined"
          size="medium"
          error={!!fieldErrors.state}
          helperText={fieldErrors.state}
          sx={{ 
            minHeight: '56px',
            '& .MuiSelect-select': {
              minWidth: '120px'
            }
          }}
        >
          <MenuItem value="">Select State</MenuItem>
          {Object.entries(stateAbbreviations).map(([name, abbr]) => (
            <MenuItem key={abbr} value={abbr}>
              {abbr}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <LightingPreferences
        preferences={lightingPreferences}
        onToggle={toggleLightingPreference}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={
          isLoading || 
          !isBackendAvailable || 
          !formData.campaignName.trim() || 
          !formData.addresses.some(addr => addr.trim()) || 
          !formData.city.trim() || 
          !formData.state
        }
        sx={{ 
          mt: 3, 
          textTransform: 'none',
          height: '48px',
          fontSize: '16px'
        }}
      >
        {isLoading ? 'Creating Campaign...' : 
         !isBackendAvailable ? 'Server Unavailable' : 
         'CREATE CAMPAIGN'}
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
      )}
      {success && (
        <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <FaHome size={24} color="#f7f9fbff" />
        <Typography variant="h4" component="h1">
          Neighborhood / Address Selection
        </Typography>
      </Stack>
      
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Search, map, or upload addresses to generate marketing flyers
      </Typography>

      <Stack direction="row" spacing={2} mb={4}>
        <Button
          startIcon={<FaMapMarkerAlt />}
          variant={activeTab === 'map' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('map')}
        >
          Map Link
        </Button>
        <Button
          startIcon={<FaMapMarkerAlt />}
          variant={activeTab === 'address' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('address')}
        >
          Enter Address
        </Button>
        <Button
          startIcon={<IoCloudUploadOutline />}
          variant={activeTab === 'upload' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('upload')}
        >
          Upload CSV
        </Button>
      </Stack>

      {renderAddressForm()}
    </Box>
  );
};

export default CreateCampaign;