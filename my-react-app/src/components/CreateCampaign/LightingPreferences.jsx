import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Stack
} from '@mui/material';

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
    // Just update the raw string value
    onToggle({
      ...preferences,
      [section]: {
        ...preferences[section],
        [field]: value
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
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Lighting Preferences (Optional)</Typography>
      
      <Stack spacing={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" className="section-title" gutterBottom>Scene Settings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                label="Time of Day"
                value={preferences.scene.time_of_day}
                onChange={(e) => handleChange('scene', 'time_of_day', e.target.value)}
              >
                <MenuItem value="">Select Time of Day</MenuItem>
                <MenuItem value="dawn">Dawn</MenuItem>
                <MenuItem value="twilight">Twilight</MenuItem>
                <MenuItem value="dusk">Dusk</MenuItem>
                <MenuItem value="night">Night</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                label="Season"
                value={preferences.scene.season}
                onChange={(e) => handleChange('scene', 'season', e.target.value)}
              >
                <MenuItem value="">Select Season</MenuItem>
                <MenuItem value="winter">Winter</MenuItem>
                <MenuItem value="fall">Fall</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                label="Weather"
                value={preferences.scene.weather}
                onChange={(e) => handleChange('scene', 'weather', e.target.value)}
              >
                <MenuItem value="">Select Weather</MenuItem>
                <MenuItem value="clear">Clear</MenuItem>
                <MenuItem value="light snow">Light Snow</MenuItem>
                <MenuItem value="heavy snow">Heavy Snow</MenuItem>
                <MenuItem value="cloudy">Cloudy</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                label="View Angle"
                value={preferences.scene.view_angle}
                onChange={(e) => handleChange('scene', 'view_angle', e.target.value)}
              >
                <MenuItem value="">Select View Angle</MenuItem>
                <MenuItem value="straight on">Straight On</MenuItem>
                <MenuItem value="slightly elevated frontal">Slightly Elevated</MenuItem>
                <MenuItem value="elevated">Elevated</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" className="section-title" gutterBottom>General Lighting</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                label="Theme"
                value={preferences.lighting.overall_theme}
                onChange={(e) => handleChange('lighting', 'overall_theme', e.target.value)}
              >
                <MenuItem value="">Select Theme</MenuItem>
                <MenuItem value="classic multicolor">Classic Multicolor</MenuItem>
                <MenuItem value="warm white">Warm White</MenuItem>
                <MenuItem value="cool white">Cool White</MenuItem>
                <MenuItem value="red and green">Red and Green</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                label="Brightness"
                value={preferences.lighting.brightness}
                onChange={(e) => handleChange('lighting', 'brightness', e.target.value)}
              >
                <MenuItem value="">Select Brightness</MenuItem>
                <MenuItem value="subtle">Subtle</MenuItem>
                <MenuItem value="balanced">Balanced</MenuItem>
                <MenuItem value="bright">Bright</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                label="Density"
                value={preferences.lighting.density}
                onChange={(e) => handleChange('lighting', 'density', e.target.value)}
              >
                <MenuItem value="">Select Density</MenuItem>
                <MenuItem value="sparse">Sparse</MenuItem>
                <MenuItem value="moderate">Moderate</MenuItem>
                <MenuItem value="full">Full</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                label="Effect"
                value={preferences.lighting.effect}
                onChange={(e) => handleChange('lighting', 'effect', e.target.value)}
              >
                <MenuItem value="">Select Effect</MenuItem>
                <MenuItem value="steady">Steady</MenuItem>
                <MenuItem value="twinkling">Twinkling</MenuItem>
                <MenuItem value="chasing">Chasing</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" className="section-title">Roof Lights</Typography>
            <Switch
              checked={preferences.roof_lights.enabled}
              onChange={(e) => handleToggle('roof_lights', e.target.checked)}
            />
          </Box>
          {preferences.roof_lights.enabled && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                  label="Bulb Size"
                  value={preferences.roof_lights.bulb_size}
                  onChange={(e) => handleChange('roof_lights', 'bulb_size', e.target.value)}
                >
                  <MenuItem value="">Select Bulb Size</MenuItem>
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                  label="Style"
                  value={preferences.roof_lights.style}
                  onChange={(e) => handleChange('roof_lights', 'style', e.target.value)}
                >
                  <MenuItem value="">Select Style</MenuItem>
                  <MenuItem value="C9 bulbs">C9 Bulbs</MenuItem>
                  <MenuItem value="mini lights">Mini Lights</MenuItem>
                  <MenuItem value="icicle lights">Icicle Lights</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="medium"
                  sx={{ 
                    '& .MuiSelect-select': {
                      minWidth: '120px'
                    },
                    minHeight: '56px'
                  }}
                  label="Colors (comma-separated)"
                  placeholder="e.g. red,blue,green"
                  value={preferences.roof_lights.colors}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    onToggle({
                      ...preferences,
                      roof_lights: {
                        ...preferences.roof_lights,
                        colors: newValue
                      }
                    });
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    const colors = value.split(',')
                      .map(v => v.trim())
                      .filter(v => v);
                    onToggle({
                      ...preferences,
                      roof_lights: {
                        ...preferences.roof_lights,
                        colors: colors
                      }
                    });
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" className="section-title">Window Lights</Typography>
            <Switch
              checked={preferences.window_lights.enabled}
              onChange={(e) => handleToggle('window_lights', e.target.checked)}
            />
          </Box>
          {preferences.window_lights.enabled && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                  label="Style"
                  value={preferences.window_lights.style}
                  onChange={(e) => handleChange('window_lights', 'style', e.target.value)}
                >
                  <MenuItem value="">Select Style</MenuItem>
                  <MenuItem value="candle lights in each window">Candle Lights</MenuItem>
                  <MenuItem value="string lights">String Lights</MenuItem>
                  <MenuItem value="icicle lights">Icicle Lights</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  size="medium"
                sx={{ 
                  '& .MuiSelect-select': {
                    minWidth: '120px'
                  },
                  minHeight: '56px'
                }}
                  label="Color"
                  value={preferences.window_lights.color}
                  onChange={(e) => handleChange('window_lights', 'color', e.target.value)}
                >
                  <MenuItem value="">Select Color</MenuItem>
                  <MenuItem value="warm white">Warm White</MenuItem>
                  <MenuItem value="cool white">Cool White</MenuItem>
                  <MenuItem value="multicolor">Multicolor</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.window_lights.interior_glow}
                      onChange={(e) => handleChange('window_lights', 'interior_glow', e.target.checked)}
                    />
                  }
                  label="Interior Glow"
                />
              </Grid>
            </Grid>
          )}
        </Paper>

        {/* Image settings are now fixed to landscape and 4K */}
      </Stack>
    </Box>
  );
};

LightingPreferences.propTypes = {
  preferences: PropTypes.shape({
    scene: PropTypes.shape({
      time_of_day: PropTypes.string,
      season: PropTypes.string,
      weather: PropTypes.string,
      view_angle: PropTypes.string
    }),
    lighting: PropTypes.shape({
      overall_theme: PropTypes.string,
      brightness: PropTypes.string,
      density: PropTypes.string,
      effect: PropTypes.string
    }),
    roof_lights: PropTypes.shape({
      enabled: PropTypes.bool,
      bulb_size: PropTypes.string,
      style: PropTypes.string,
      colors: PropTypes.arrayOf(PropTypes.string)
    }),
    window_lights: PropTypes.shape({
      enabled: PropTypes.bool,
      style: PropTypes.string,
      color: PropTypes.string,
      interior_glow: PropTypes.bool
    }),
    image_settings: PropTypes.shape({
      resolution: PropTypes.string,
      format: PropTypes.string
    })
  }).isRequired,
  onToggle: PropTypes.func.isRequired
};

export default LightingPreferences;