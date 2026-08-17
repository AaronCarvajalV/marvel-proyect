import apiClient from './client';
import { User, AuthResponseData } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  password_confirmation: string;
  rol?: 'ADMIN' | 'CONSULTA';
}

export const authApi = {
  /**
   * Log in with credentials and obtain JWT.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponseData> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data;
  },

  /**
   * Get authenticated user profile using current Bearer JWT.
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    // Backend returns { success: true, data: { id, nombre, email, rol, created_at } }
    // Or in some formats { success: true, data: { user: { ... } } }
    const raw = response.data.data;
    if (raw && raw.user) {
      return raw.user;
    }
    return raw as User;
  },

  /**
   * Log out and invalidate JWT.
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Allow logout to proceed even if network or server error happens
    }
  },

  /**
   * Register a new user (optional public endpoint).
   */
  register: async (data: RegisterData): Promise<AuthResponseData> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  },
};

export default authApi;
