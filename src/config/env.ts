import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_API_BASE_URL = 'http://192.168.100.29:8000/api';
export const STORAGE_KEY_CUSTOM_API = '@marvel_custom_api_url';

let currentBaseUrl = DEFAULT_API_BASE_URL;

/**
 * Derives the optimal default base URL based on the Expo development host URI.
 */
export const resolveInitialApiBaseUrl = (): string => {
  try {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return `http://${ip}:8000/api`;
      }
    }
  } catch {
    // Fallback to default
  }
  return DEFAULT_API_BASE_URL;
};

export const getApiBaseUrl = (): string => {
  return currentBaseUrl;
};

export const setApiBaseUrl = (url: string): void => {
  let formattedUrl = url.trim();
  if (!formattedUrl.endsWith('/api') && !formattedUrl.endsWith('/api/')) {
    formattedUrl = formattedUrl.replace(/\/+$/, '') + '/api';
  }
  currentBaseUrl = formattedUrl;
};

export const initializeApiBaseUrl = async (): Promise<string> => {
  try {
    const customUrl = await AsyncStorage.getItem(STORAGE_KEY_CUSTOM_API);
    if (customUrl) {
      currentBaseUrl = customUrl;
      return customUrl;
    }
  } catch {
    // Ignore storage read error
  }
  currentBaseUrl = resolveInitialApiBaseUrl();
  return currentBaseUrl;
};

export const saveCustomApiBaseUrl = async (url: string): Promise<void> => {
  setApiBaseUrl(url);
  await AsyncStorage.setItem(STORAGE_KEY_CUSTOM_API, currentBaseUrl);
};

export const resetCustomApiBaseUrl = async (): Promise<void> => {
  currentBaseUrl = resolveInitialApiBaseUrl();
  await AsyncStorage.removeItem(STORAGE_KEY_CUSTOM_API);
};
