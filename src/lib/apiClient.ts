/// <reference types="vite/client" />
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send HttpOnly Cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Inject Authorization Bearer Token as fallback if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lamarra_jwt_token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle global response errors (e.g. 401 Unauthorized or 403 Forbidden)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('lamarra_jwt_token');
      localStorage.removeItem('lamarra_current_user_v1');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
