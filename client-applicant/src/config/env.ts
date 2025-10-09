// Environment Configuration
// This file provides type-safe access to environment variables

export interface EnvConfig {
  ENV: 'local' | 'staging' | 'production';
  API_URL: string;
}

export const env: EnvConfig = {
  ENV: (import.meta.env.VITE_ENV as EnvConfig['ENV']) || 'local',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
};

// Environment-specific configurations
export const isLocal = env.ENV === 'local';
export const isStaging = env.ENV === 'staging';
export const isProduction = env.ENV === 'production';

// Debug logging (only in non-production)
if (!isProduction) {
  console.log('Environment Config:', env);
}

export default env;
