import env from '@/config/env';

/**
 * HTTP Methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API Request Configuration
 */
export interface ApiRequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

/**
 * API Response Structure
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

/**
 * API Error Structure
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

/**
 * Custom API Error Class
 */
export class ApiException extends Error {
  public status: number;
  public code?: string;
  public details?: unknown;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiException';
    this.status = error.status;
    this.code = error.code;
    this.details = error.details;
  }
}

/**
 * Reusable API Service Class
 */
class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor() {
    this.baseURL = env.API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.defaultTimeout = 10000; // 10 seconds
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authentication token
   */
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Build query string from params
   */
  private buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
      timeout = this.defaultTimeout,
    } = config;

    // Build URL with query parameters
    const queryString = params ? this.buildQueryString(params) : '';
    const url = `${this.baseURL}${endpoint}${queryString}`;

    // Merge headers
    const mergedHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: mergedHeaders,
      signal: AbortSignal.timeout(timeout),
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestOptions);

      // Handle non-JSON responses
      let data: unknown;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorData: ApiError = {
          message: (data as { message?: string })?.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          code: (data as { code?: string })?.code,
          details: (data as { details?: unknown })?.details || data,
        };
        throw new ApiException(errorData);
      }

      // Return data directly if it's already in the expected format
      // Otherwise, wrap it in our standard response format
      if (data && typeof data === 'object' && data !== null && 'data' in data) {
        return data as T;
      }

      return data as T;

    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }

      // Handle network errors, timeouts, etc.
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 0, // Network error
        code: 'NETWORK_ERROR',
      };

      throw new ApiException(apiError);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>, config?: Omit<ApiRequestConfig, 'method' | 'params'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET', params });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Upload file with multipart/form-data
   */
  async upload<T>(endpoint: string, formData: FormData, config?: Omit<ApiRequestConfig, 'method' | 'body' | 'headers'>): Promise<T> {
    // Remove Content-Type header to let browser set it with boundary
    const { 'Content-Type': _, ...headersWithoutContentType } = this.defaultHeaders;

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: formData,
      headers: headersWithoutContentType,
    });
  }
}

// Create and export singleton instance
export const apiService = new ApiService();

// Export convenience functions for use with TanStack Query
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>) =>
    apiService.get<T>(endpoint, params),

  post: <T>(endpoint: string, body?: unknown) =>
    apiService.post<T>(endpoint, body),

  put: <T>(endpoint: string, body?: unknown) =>
    apiService.put<T>(endpoint, body),

  patch: <T>(endpoint: string, body?: unknown) =>
    apiService.patch<T>(endpoint, body),

  delete: <T>(endpoint: string) =>
    apiService.delete<T>(endpoint),

  upload: <T>(endpoint: string, formData: FormData) =>
    apiService.upload<T>(endpoint, formData),
};

export default apiService;
