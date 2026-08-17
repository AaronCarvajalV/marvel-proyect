import { api } from './api';
import type { Hero } from './heroService';
import type { TargetLocation } from './targetLocationService';

export interface Mission {
  id: number;
  titulo: string;
  descripcion: string | null;
  target_location_id: number;
  target_location?: TargetLocation;
  fecha: string;
  nivel_peligro: string; // ALTO, MEDIO, BAJO, EXTREMO
  estado: string; // PENDIENTE, EN_PROGRESO, COMPLETADA, CANCELADA
  superheroe_id: number | null;
  hero?: Hero;
  created_at: string;
  updated_at: string;
}

export type CreateMissionData = Omit<Mission, 'id' | 'hero' | 'target_location' | 'created_at' | 'updated_at'>;

export const missionService = {
  getAll: async () => {
    const response = await api.get('/misiones');
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/misiones/${id}`);
    return response.data.data;
  },

  create: async (data: CreateMissionData) => {
    const response = await api.post('/misiones', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<CreateMissionData>) => {
    const response = await api.put(`/misiones/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/misiones/${id}`);
    return response.data;
  }
};
