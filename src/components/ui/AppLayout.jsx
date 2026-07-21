import React from 'react';
import { Box } from '@mui/material';

/**
 * AppLayout – Global shell wrapper.
 * Ensures content fills viewport and footer (if added later) is pushed to the bottom.
 * ErrorModal and AlertCenter portals are rendered by their own providers,
 * so they are already accessible across all routes.
 */
const AppLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Main content area — grows to push any future footer to the bottom */}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
