import { api } from './api';

export interface Hero {
  id: number;
  nombre: string;
  nombre_real: string | null;
  poder_principal: string;
  nivel_poder: number;
  imagen_url: string | null;
  estado: string; // ACTIVO, INACTIVO, MIA
  missions?: any[]; // Temporal for now
  created_at: string;
  updated_at: string;
}

export type CreateHeroData = Omit<Hero, 'id' | 'created_at' | 'updated_at'>;

export const heroService = {
  getAll: async () => {
    const response = await api.get<Hero[]>('/heroes');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Hero>(`/heroes/${id}`);
    return response.data;
  },

  create: async (data: CreateHeroData) => {
    const response = await api.post<Hero>('/heroes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateHeroData>) => {
    const response = await api.put<Hero>(`/heroes/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/heroes/${id}`);
    return response.data;
  }
};
