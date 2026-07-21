import axios from 'axios';
import backendConfig from '../config/backend';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: `${backendConfig.baseURL}${backendConfig.apiPrefix}`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // send DEVOPS_SESSION cookie on every request
    });

    // Response interceptor — redirect to login on 401 (but not for the login request itself)
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const isLoginRequest = error.config?.url?.includes('/auth/login');
        if (error.response?.status === 401 && !isLoginRequest) {
          // Session expired or not authenticated — redirect to login
          window.location.href = '/devops/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ─── Authentication ───

  /**
   * POST /auth/login
   * Returns { success, message, data: { username, displayName, email, sessionId }, timestamp }
   * The backend sets an HttpOnly DEVOPS_SESSION cookie automatically.
   */
  async login(username, password) {
    const response = await this.api.post('/auth/login', { username, password });
    return response.data;
  }
}

export const apiService = new ApiService();
