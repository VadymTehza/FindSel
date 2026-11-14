import { useContext } from 'react';
import { AuthContext } from './authContext.js';

// Хук авторизації: { user, loading, login, register, logout, updateUser }
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
