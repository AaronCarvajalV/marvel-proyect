import { api } from './api';

export interface TargetLocation {
  id: number;
  city: string;
  country: string;
  country_code: string;
}

export const targetLocationService = {
  getAll: async () => {
    const response = await api.get('/target-locations');
    return response.data.data;
  }
};
