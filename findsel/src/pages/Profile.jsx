import { Link, NavLink, Navigate, Outlet, useParams } from 'react-router-dom';
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
  const menu = MENU[role];

  if (!menu) return <Navigate to="/profile/seller" replace />;

  const target = (key) => {
    if (key === 'chats') return '/chats';
    return key ? `/profile/${role}/${key}` : `/profile/${role}`;
  };

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.avatar} aria-hidden>
          👤
        </div>
        <strong className={styles.name}>Ім’я</strong>
        {role === 'seller' && <span className={styles.rate}>☆4,9</span>}
        <nav className={styles.menu} aria-label="Розділи профілю">
          {menu.map(([key, label]) => (
            <NavLink
              key={key || 'main'}
              to={target(key)}
              end
              className={({ isActive }) => (isActive ? styles.on : '')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/login" className={styles.logout}>
          Вийти
        </Link>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
