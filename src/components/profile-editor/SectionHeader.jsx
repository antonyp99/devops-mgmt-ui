import React from 'react';
import { Box, Typography, Avatar, alpha, useTheme } from '@mui/material';

/**
 * Reusable accordion section header used by all config panels.
 */
const SectionHeader = ({ icon, title, desc, color }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar sx={{ width: 34, height: 34, bgcolor: alpha(color || theme.palette.primary.main, 0.12) }}>
        {React.cloneElement(icon, { sx: { fontSize: 18, color: color || 'primary.main' }, titleAccess: title })}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{desc}</Typography>
      </Box>
    </Box>
  );
};

export default SectionHeader;
