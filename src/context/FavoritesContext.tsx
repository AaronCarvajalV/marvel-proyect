import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextData {
  favorites: number[];
  toggleFavorite: (heroId: number) => void;
  isFavorite: (heroId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextData | undefined>(undefined);

const STORAGE_KEY = '@marvel_favorites_web';

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = (heroId: number) => {
    setFavorites((prev) => {
      const newFavs = prev.includes(heroId)
        ? prev.filter((id) => id !== heroId)
        : [...prev, heroId];
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
      } catch (e) {
        console.error('Failed to save favorites', e);
      }
      return newFavs;
    });
  };

  const isFavorite = (heroId: number) => favorites.includes(heroId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextData => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
