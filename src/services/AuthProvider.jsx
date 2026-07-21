import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from './api';

const AuthContext = createContext(undefined);

const USER_STORAGE_KEY = 'devops_user';

// TEMPORARY: when VITE_AUTH_FROM_API is "false", login succeeds for any credentials
// without hitting the backend. Remove this flag (and the bypass block below) once
// the backend auth API is fully integrated.
const AUTH_FROM_API = import.meta.env.VITE_AUTH_FROM_API !== 'false';

/**
 * AuthProvider — session-based authentication.
 *
 * On login the backend sets an HttpOnly `DEVOPS_SESSION` cookie.
 * We persist the user profile in sessionStorage so the UI can
 * survive page refreshes without an extra /me round-trip.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const authenticated = !!user;

  // Keep sessionStorage in sync with state
  useEffect(() => {
    if (user) {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  /**
   * Call the backend login endpoint.
   * Returns { success, error?, status? }
   */
  const loginWithCredentials = async (username, password) => {
    // ── TEMPORARY bypass — start (remove when backend auth is ready) ──
    if (!AUTH_FROM_API) {
      const mockUser = {
        username,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username}@devops.com`,
        sessionId: 'local-bypass',
      };
      setUser(mockUser);
      return { success: true };
    }
    // ── TEMPORARY bypass — end ──

    try {
      const result = await apiService.login(username, password);

      if (result.success) {
        setUser(result.data); // { username, displayName, email, sessionId }
        return { success: true };
      }

      return {
        success: false,
        error: result.message || 'Authentication failed',
      };
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;

      if (status === 401) {
        return { success: false, status, error: body?.message || 'Invalid credentials' };
      }
      if (status === 400) {
        const fieldErrors = body?.errors?.map((e) => e.message).join('. ');
        return { success: false, status, error: fieldErrors || body?.message || 'Validation failed' };
      }
      return { success: false, status: 0, error: 'Network error or server unavailable' };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    // If a backend logout endpoint exists later, call it here.
  };

  const contextValue = {
    user,
    authenticated,
    loading,
    loginWithCredentials,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
