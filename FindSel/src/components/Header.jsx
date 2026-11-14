import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { useCart } from '../context/useCart.js';
import styles from './Header.module.css';

export default function Header() {
  const { user } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');

  const search = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            FindSel
          </Link>
          <form onSubmit={search} role="search">
            <input
              className={styles.search}
              type="search"
              placeholder="Пошук"
              aria-label="Пошук"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
        <div className={styles.right}>
          <nav className={styles.icons} aria-label="Швидкі дії">
            <Link
              to="/cart"
              className={styles.cartLink}
              aria-label={`Кошик, товарів: ${count}`}
            >
              🧺
              {count > 0 && <span className={styles.badge}>{count}</span>}
            </Link>
            <Link to="/chats" aria-label="Чати">
              💬
            </Link>
            <Link
              to={user ? `/profile/${user.role}/favorites` : '/login'}
              aria-label="Обране"
            >
              ♡
            </Link>
          </nav>
          {user ? (
            <Link to={`/profile/${user.role}`} className={styles.userLink}>
              👤 {user.name}
            </Link>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login">Увійти</Link>
              <Link to="/register">Зареєструватись</Link>
            </div>
          )}
          <Link to="/create" className={styles.create}>
            + Створити оголошення
          </Link>
        </div>
      </div>
    </header>
  );
}
