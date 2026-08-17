import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@marvel_auth_token',
  FAVORITE_HERO_IDS: '@marvel_favorite_hero_ids',
  CUSTOM_API_URL: '@marvel_custom_api_url',
} as const;

// Token operations
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch {
    return null;
  }
};

export const setStoredToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Failed to store auth token in AsyncStorage:', error);
  }
};

export const removeStoredToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Failed to remove auth token from AsyncStorage:', error);
  }
};

// Favorite hero IDs operations
export const getStoredFavoriteHeroIds = async (): Promise<number[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_HERO_IDS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((id: unknown) => Number(id)).filter((id: number) => !isNaN(id)) : [];
  } catch {
    return [];
  }
};

export const setStoredFavoriteHeroIds = async (ids: number[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_HERO_IDS, JSON.stringify(ids));
  } catch (error) {
    console.error('Failed to store favorite hero IDs in AsyncStorage:', error);
  }
};
