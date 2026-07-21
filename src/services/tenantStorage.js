/**
 * tenantStorage.js
 *
 * Tenants are loaded from src/data/tenants.json — the single shared source of truth.
 * To add or remove tenants, edit that file and redeploy.
 *
 * NOTE: Replace with a real API call (GET /tenants) once a backend endpoint is available.
 */

import defaultTenants from '../data/tenants.json';

/**
 * Returns all tenants from src/data/tenants.json.
 * Any tenants added via the UI during a session are included in-memory only
 * and will not persist after a page refresh.
 */
export const loadTenantsFromStorage = () => defaultTenants;
