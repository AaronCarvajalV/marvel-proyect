import apiClient from './client';
import { TargetLocation } from '../types';

export const locationsApi = {
  /**
   * Fetch listing of all target locations.
   */
  getTargetLocations: async (): Promise<TargetLocation[]> => {
    const response = await apiClient.get('/target-locations');
    return response.data.data;
  },
};

export default locationsApi;
