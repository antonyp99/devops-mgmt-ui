import React from 'react';
import {
  Grid, Box, Typography,
  FormControl, InputLabel, Select, MenuItem, Button,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

const ProfileSelectorBar = ({
  profiles,
  selectedProfile,
  onProfileChange,
  selectedEnvironment,
  onEnvironmentChange,
}) => {
  const currentProfile = profiles[selectedProfile];

  return (
    <Box>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Profile</InputLabel>
              <Select
                value={selectedProfile}
                onChange={(e) => onProfileChange(e.target.value)}
                label="Profile"
              >
                {Object.entries(profiles).map(([key, profile]) => (
                  <MenuItem key={key} value={key}>
                    {profile.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {currentProfile && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {currentProfile.description}
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Environment</InputLabel>
                <Select
                  value={selectedEnvironment}
                  onChange={(e) => onEnvironmentChange(e.target.value)}
                  label="Environment"
                >
                  {currentProfile?.files.map((file) => (
                    <MenuItem key={file} value={file}>
                      {file.replace('values-', '').replace('.yaml', '').replace('values', 'Default')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                size="small"
                startIcon={<UploadIcon titleAccess="Upload YAML values file" />}
                component="label"
                sx={{ whiteSpace: 'nowrap', minWidth: 'auto', px: 1.5 }}
              >
                Upload
                <input type="file" accept=".yaml,.yml" hidden />
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              File: <strong>{selectedEnvironment}</strong>
            </Typography>
          </Grid>
        </Grid>
    </Box>
  );
};

export default ProfileSelectorBar;
