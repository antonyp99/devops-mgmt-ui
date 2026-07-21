/**
 * Backend configuration for DevOps Management Platform.
 *
 * All backend-related settings are centralised here so that
 * switching environments only requires updating env variables
 * or the defaults below.
 */

const backendConfig = {
  /** Base URL of the backend (no trailing slash) */
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',

  /** Prefix applied to every API call */
  apiPrefix: import.meta.env.VITE_API_PREFIX || '/api/devops',

  /** Session cookie name set by the backend */
  sessionCookieName: 'DEVOPS_SESSION',
};

export default backendConfig;
