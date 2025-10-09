// Toggle between mock and live API
export const API_CONFIG = {
  // Set to true to use mock data, false to use real backend
  USE_MOCK: false,

  // Base URL for the real API
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://bookipi-ats-server-staging.up.railway.app/api/v1',

  // JWT token (in real app, this would come from auth flow)
  AUTH_TOKEN: import.meta.env.VITE_AUTH_TOKEN || '',
};

export const getApiUrl = (path: string) => {
  return `${API_CONFIG.BASE_URL}${path}`;
};

export const getAuthHeaders = () => {
  if (!API_CONFIG.AUTH_TOKEN) return {};
  return {
    Authorization: `Bearer ${API_CONFIG.AUTH_TOKEN}`,
  };
};
