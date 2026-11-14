import { useCallback, useEffect, useMemo, useState } from 'react';
import { getToken, request, setToken } from '../api/client.js';
import { AuthContext } from './authContext.js';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  // відновлення сесії після оновлення сторінки
  useEffect(() => {
    if (!getToken()) return undefined;
    let cancelled = false;
    request('/auth/me')
      .then((u) => !cancelled && setUser(u))
      .catch(() => setToken(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const authenticate = useCallback((data) => {
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(
    async (email, password) =>
      authenticate(await request('/auth/login', { method: 'POST', body: { email, password } })),
    [authenticate]
  );

  const register = useCallback(
    async (payload) =>
      authenticate(await request('/auth/register', { method: 'POST', body: payload })),
    [authenticate]
  );

  const logout = useCallback(async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // навіть якщо сервер недоступний — виходимо локально
    }
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, updateUser: setUser }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
