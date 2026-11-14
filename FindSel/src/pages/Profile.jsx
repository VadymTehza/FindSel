import { NavLink, Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import styles from './Profile.module.css';

const MENU = {
  seller: [
    ['', 'Мої оголошення'],
    ['chats', 'Повідомлення'],
    ['favorites', 'Обране'],
    ['stats', 'Статистика'],
    ['wallet', 'Гаманець'],
    ['settings', 'Налаштування'],
  ],
  buyer: [
    ['', 'Мої покупки'],
    ['chats', 'Повідомлення'],
    ['favorites', 'Обране'],
    ['reviews', 'Мої відгуки'],
    ['addresses', 'Адреси доставки'],
    ['settings', 'Налаштування'],
  ],
};

export default function Profile() {
  const { role } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menu = MENU[role];

  if (!menu) return <Navigate to="/profile" replace />;
  if (user.role !== role) return <Navigate to={`/profile/${user.role}`} replace />;

  const target = (key) => {
    if (key === 'chats') return '/chats';
    return key ? `/profile/${role}/${key}` : `/profile/${role}`;
  };
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.avatar} aria-hidden>
          👤
        </div>
        <strong className={styles.name}>{user.name}</strong>
        <span className={styles.rate}>{role === 'seller' ? 'Продавець' : 'Покупець'}</span>
        <nav className={styles.menu} aria-label="Розділи профілю">
          {menu.map(([key, label]) => (
            <NavLink key={key || 'main'} to={target(key)} end className={({ isActive }) => (isActive ? styles.on : '')}>
              {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className={styles.logout} onClick={handleLogout}>
          Вийти
        </button>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
