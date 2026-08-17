import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getApiBaseUrl } from '../config/env';
import { getStoredToken, removeStoredToken } from '../storage/asyncStorage';

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const updateApiClientBaseUrl = (newUrl: string): void => {
  apiClient.defaults.baseURL = newUrl;
};

// Global 401 unauthorized subscriber callback
type UnauthorizedCallback = () => void;
let unauthorizedListeners: UnauthorizedCallback[] = [];

export const registerUnauthorizedListener = (listener: UnauthorizedCallback): (() => void) => {
  unauthorizedListeners.push(listener);
  return () => {
    unauthorizedListeners = unauthorizedListeners.filter((l) => l !== listener);
  };
};

export const triggerUnauthorized = async (): Promise<void> => {
  await removeStoredToken();
  unauthorizedListeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in unauthorized listener:', e);
    }
  });
};

// Request Interceptor: Attach JWT Bearer token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Dynamically ensure base URL is current
    config.baseURL = getApiBaseUrl();

    const token = await getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Avoid infinite loop if 401 happened during login endpoint itself
      const requestUrl = error.config?.url || '';
      if (!requestUrl.includes('/auth/login')) {
        await triggerUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
