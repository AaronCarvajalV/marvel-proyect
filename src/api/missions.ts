import apiClient from './client';
import { Mission } from '../types';

export interface GetMissionsParams {
  search?: string;
  nivel_peligro?: string;
  estado?: string;
}

export const missionsApi = {
  /**
   * Fetch listing of all missions with associated heroes and target locations.
   */
  getMissions: async (params?: GetMissionsParams): Promise<Mission[]> => {
    const response = await apiClient.get('/misiones', { params });
    return response.data.data;
  },

  /**
   * Fetch specific mission details by ID.
   */
  getMissionById: async (id: number): Promise<Mission> => {
    const response = await apiClient.get(`/misiones/${id}`);
    return response.data.data;
  },
  /**
   * Create new mission (Admin only)
   */
  createMission: async (data: Partial<Mission>): Promise<Mission> => {
    const response = await apiClient.post('/misiones', data);
    return response.data.data;
  },

  /**
   * Update existing mission (Admin only)
   */
  updateMission: async (id: number, data: Partial<Mission>): Promise<Mission> => {
    const response = await apiClient.put(`/misiones/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete mission (Admin only)
   */
  deleteMission: async (id: number): Promise<void> => {
    await apiClient.delete(`/misiones/${id}`);
  },
};

export default missionsApi;
