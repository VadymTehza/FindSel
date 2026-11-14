import { useCallback, useEffect, useMemo, useState } from 'react';
import { request } from '../api/client.js';
import { FavoritesContext } from './favoritesContext.js';
import { useAuth } from './useAuth.js';

export default function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [ids, setIds] = useState([]);

  useEffect(() => {
    if (!userId) {
      setIds([]);
      return undefined;
    }
    let cancelled = false;
    request('/favorites')
      .then((list) => !cancelled && setIds(list))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggle = useCallback(
    async (id) => {
      const has = ids.includes(id);
      setIds((prev) => (has ? prev.filter((x) => x !== id) : [...prev, id]));
      try {
        await request(`/favorites/${id}`, { method: has ? 'DELETE' : 'POST' });
      } catch {
        // сервер відмовив — повертаємо попередній стан
        setIds((prev) => (has ? [...prev, id] : prev.filter((x) => x !== id)));
      }
    },
    [ids]
  );

  const value = useMemo(
    () => ({ favorites: ids, toggle, isFavorite: (id) => ids.includes(id) }),
    [ids, toggle]
  );
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
