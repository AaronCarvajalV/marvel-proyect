import { api } from './api';
import type { Hero } from './heroService';

export interface Mission {
  id: number;
  titulo: string;
  descripcion: string | null;
  ubicacion: string;
  fecha: string;
  nivel_peligro: string; // ALTO, MEDIO, BAJO, EXTREMO
  estado: string; // PENDIENTE, EN_PROGRESO, COMPLETADA, CANCELADA
  superheroe_id: number | null;
  hero?: Hero;
  created_at: string;
  updated_at: string;
}

export type CreateMissionData = Omit<Mission, 'id' | 'hero' | 'created_at' | 'updated_at'>;

export const missionService = {
  getAll: async () => {
    const response = await api.get<Mission[]>('/misiones');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Mission>(`/misiones/${id}`);
    return response.data;
  },

  create: async (data: CreateMissionData) => {
    const response = await api.post<Mission>('/misiones', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateMissionData>) => {
    const response = await api.put<Mission>(`/misiones/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/misiones/${id}`);
    return response.data;
  }
};
