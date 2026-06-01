import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const item = window.localStorage.getItem('vibraAddisFavorites');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn('Error reading localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('vibraAddisFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  }, [favorites]);

  const toggleFavorite = (venueId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(venueId)) {
        return prevFavorites.filter((id) => id !== venueId);
      } else {
        return [...prevFavorites, venueId];
      }
    });
  };

  const isFavorite = (venueId) => {
    return favorites.includes(venueId);
  };

  return { favorites, toggleFavorite, isFavorite };
}
