import apiClient from './client';
import { Hero } from '../types';

export interface GetHeroesParams {
  search?: string;
}

export const heroesApi = {
  /**
   * Fetch listing of superheroes with optional server-side search filter.
   */
  getHeroes: async (params?: GetHeroesParams): Promise<Hero[]> => {
    const response = await apiClient.get('/heroes', { params });
    return response.data.data;
  },

  /**
   * Fetch specific superhero details by ID.
   */
  getHeroById: async (id: number): Promise<Hero> => {
    const response = await apiClient.get(`/heroes/${id}`);
    return response.data.data;
  },
};

export default heroesApi;
