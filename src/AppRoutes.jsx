import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import { useAuth } from './services/AuthProvider';

/**
 * PrivateRoute – Redirects to /devops/login when the user is not authenticated.
 */
const PrivateRoute = ({ children }) => {
  const { authenticated } = useAuth();
  return authenticated ? children : <Navigate to="/devops/login" replace />;
};

/**
 * AppRoutes – Single-URL architecture.
 *
 * Only two top-level URLs exist:
 *   /devops/login  – public authentication page
 *   /devops – the entire authenticated application (single URL)
 *
 * All section switching (Dashboard, Requests, Approvals, etc.) is handled
 * internally by Layout via component state — the URL stays at /devops throughout.
 * This keeps the app simple and avoids exposing internal navigation in the address bar.
 */
const AppRoutes = () => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return null; // Loading state is handled by AuthProvider
  }

  return (
    <Routes>
      {/* Public route – authentication only */}
      <Route path="/devops/login" element={<LoginPage />} />

      {/* Single authenticated route – all sections rendered inside Layout via state */}
      <Route
        path="/devops"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={authenticated ? '/devops' : '/devops/login'} replace />} />

      {/* Fallback – any unknown path */}
      <Route
        path="*"
        element={<Navigate to={authenticated ? '/devops' : '/devops/login'} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;

