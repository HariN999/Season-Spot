import { useState, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue((prevValue) => {
        const valueToStore = value instanceof Function ? value(prevValue) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('ss-favorites', []);

  const toggleFavorite = useCallback((stateName) => {
    setFavorites(prev =>
      prev.includes(stateName)
        ? prev.filter(s => s !== stateName)
        : [...prev, stateName]
    );
  }, [setFavorites]);

  const isFavorite = useCallback((stateName) => {
    return favorites.includes(stateName);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useLocalStorage('ss-recent', []);

  const addViewed = useCallback((stateName) => {
    setRecent(prev => {
      const filtered = prev.filter(s => s !== stateName);
      return [stateName, ...filtered].slice(0, 8);
    });
  }, [setRecent]);

  return { recentlyViewed: recent, addViewed };
}
