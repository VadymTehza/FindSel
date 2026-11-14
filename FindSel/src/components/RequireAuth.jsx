import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import styles from './RequireAuth.module.css';

// Захищений маршрут: без входу — на /login, з неправильною роллю — повідомлення
export default function RequireAuth({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className={styles.msg}>Завантаження…</p>;
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  if (role && user.role !== role) {
    return (
      <main className={styles.denied}>
        <h1>Недостатньо прав</h1>
        <p>Ця сторінка доступна лише для ролі «{role === 'seller' ? 'продавець' : 'покупець'}».</p>
        <Link to="/">На головну</Link>
      </main>
    );
  }
  return children;
}
