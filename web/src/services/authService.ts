
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

import { api } from './api';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    // Laravel returns: { success: true, data: { user: {...}, access_token: '...' } }
    const data = response.data.data;
    return {
      access_token: data.access_token,
      user: {
        id: data.user.id,
        name: data.user.nombre,
        email: data.user.email,
        role: data.user.rol
      }
    };
  },
  
  register: async (credentials: { nombre: string; email: string; password: string; password_confirmation: string; rol?: string }) => {
    const response = await api.post('/auth/register', credentials);
    const data = response.data.data;
    return {
      access_token: data.access_token,
      user: {
        id: data.user.id,
        name: data.user.nombre,
        email: data.user.email,
        role: data.user.rol
      }
    };
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    // Laravel returns: { success: true, data: { id, nombre, email, rol } }
    // But we expect the frontend User interface, which requires 'name' instead of 'nombre' and 'role' instead of 'rol'
    const data = response.data.data;
    return {
      id: data.id,
      name: data.nombre,
      email: data.email,
      role: data.rol
    };
  }
};
