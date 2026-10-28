import { useCallback, useEffect, useMemo, useState } from 'react';
import { FavoritesContext } from './favoritesContext.js';

const KEY = 'findsel:favorites';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export default function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites));
    } catch {
      // сховище недоступне — ігноруємо
    }
  }, [favorites]);

  const toggle = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const value = useMemo(
    () => ({ favorites, toggle, isFavorite: (id) => favorites.includes(id) }),
    [favorites, toggle]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
