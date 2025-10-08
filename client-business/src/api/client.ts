import axios, { type AxiosInstance } from 'axios';
import { API_CONFIG, getAuthHeaders } from './config';

// Create axios instance for real API calls
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
  },
});

// Axios interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
