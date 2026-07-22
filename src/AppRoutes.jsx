import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import { useAuth } from './services/AuthProvider';

/**
 * PrivateRoute – Redirects to /login when the user is not authenticated.
 */
const PrivateRoute = ({ children }) => {
  const { authenticated } = useAuth();
  return authenticated ? children : <Navigate to="/login" replace />;
};

/**
 * AppRoutes – Single-URL architecture.
 *
 * Only two top-level URLs exist:
 *   /login  – public authentication page
 *   /       – the entire authenticated application (single URL)
 *
 * All section switching (Dashboard, Requests, Approvals, etc.) is handled
 * internally by Layout via component state — the URL stays at / throughout.
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
      <Route path="/login" element={<LoginPage />} />

      {/* Single authenticated route – all sections rendered inside Layout via state */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      />

      {/* Fallback – any unknown path */}
      <Route
        path="*"
        element={<Navigate to={authenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;

