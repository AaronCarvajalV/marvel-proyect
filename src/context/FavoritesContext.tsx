import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getStoredFavoriteHeroIds, setStoredFavoriteHeroIds } from '../storage/asyncStorage';

interface FavoritesContextType {
  favoriteIds: number[];
  isFavorite: (heroId: number) => boolean;
  toggleFavorite: (heroId: number) => Promise<void>;
  addFavorite: (heroId: number) => Promise<void>;
  removeFavorite: (heroId: number) => Promise<void>;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load favorite IDs from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await getStoredFavoriteHeroIds();
      setFavoriteIds(stored);
      setIsLoaded(true);
    };
    loadFavorites();
  }, []);

  const isFavorite = useCallback(
    (heroId: number): boolean => {
      return favoriteIds.includes(heroId);
    },
    [favoriteIds]
  );

  const addFavorite = useCallback(
    async (heroId: number): Promise<void> => {
      setFavoriteIds((prev) => {
        if (prev.includes(heroId)) return prev;
        const updated = [...prev, heroId];
        setStoredFavoriteHeroIds(updated);
        return updated;
      });
    },
    []
  );

  const removeFavorite = useCallback(
    async (heroId: number): Promise<void> => {
      setFavoriteIds((prev) => {
        const updated = prev.filter((id) => id !== heroId);
        setStoredFavoriteHeroIds(updated);
        return updated;
      });
    },
    []
  );

  const toggleFavorite = useCallback(
    async (heroId: number): Promise<void> => {
      if (favoriteIds.includes(heroId)) {
        await removeFavorite(heroId);
      } else {
        await addFavorite(heroId);
      }
    },
    [favoriteIds, addFavorite, removeFavorite]
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      favoritesCount: favoriteIds.length,
    }),
    [favoriteIds, isFavorite, toggleFavorite, addFavorite, removeFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;
