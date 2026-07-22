import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './services/AuthProvider';
import { AlertCenterProvider } from './contexts/AlertCenter';
import AppLayout from './components/ui/AppLayout';
import AppRoutes from './AppRoutes';
import { ThemePrefsProvider, useThemePrefs } from './contexts/ThemeContext';

/**
 * Inner shell — reads the user-selected theme from context and injects it into MUI.
 * Kept separate so ThemePrefsProvider can wrap it without a circular dependency.
 */
function ThemedApp() {
  const { theme } = useThemePrefs();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <HashRouter>
          <AlertCenterProvider>
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </AlertCenterProvider>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

/**
 * Provider Nesting Order:
 *  ThemePrefsProvider → ThemedApp → ThemeProvider (dynamic) → CssBaseline
 *    → AuthProvider → BrowserRouter → AlertCenterProvider → AppLayout → AppRoutes
 */
function App() {
  return (
    <ThemePrefsProvider>
      <ThemedApp />
    </ThemePrefsProvider>
  );
}

export default App;

