import { api } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'CONSULTA'; // Assuming these roles based on the prompt
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get<User>('/me'); // or /auth/me depending on backend setup
    // Based on the Laravel routes we saw earlier, login/register/logout are public, but /me wasn't explicitly shown. 
    // The prompt says GET /api/auth/me but the routes file had /api/logout. We'll use /me for now.
    return response.data;
  }
};
