import { useState } from 'react';
import Link from '../components/Link.jsx';
import FavoritesList from '../components/FavoritesList.jsx';
import MyListings from '../components/MyListings.jsx';
import MyPurchases from '../components/MyPurchases.jsx';
import Settings from '../components/Settings.jsx';
import styles from './Profile.module.css';

const MENU = {
  seller: [
    ['main', 'Мої оголошення'],
    ['chats', 'Повідомлення'],
    ['favorites', 'Обране'],
    ['stats', 'Статистика'],
    ['wallet', 'Гаманець'],
    ['settings', 'Налаштування'],
  ],
  buyer: [
    ['main', 'Мої покупки'],
    ['chats', 'Повідомлення'],
    ['favorites', 'Обране'],
    ['reviews', 'Мої відгуки'],
    ['addresses', 'Адреси доставки'],
    ['settings', 'Налаштування'],
  ],
};

export default function Profile({ role = 'seller' }) {
  const [tab, setTab] = useState('main'); // який розділ показати
  const menu = MENU[role] ?? MENU.seller;

  let content;
  if (tab === 'main') {
    content = role === 'buyer' ? <MyPurchases /> : <MyListings />;
  } else if (tab === 'favorites') {
    content = <FavoritesList />;
  } else if (tab === 'settings') {
    content = <Settings />;
  } else {
    content = <h1>Розділ у розробці</h1>;
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.avatar} aria-hidden>
          👤
        </div>
        <strong className={styles.name}>Ім’я</strong>
        {role === 'seller' && <span className={styles.rate}>☆4,9</span>}
        <nav className={styles.menu}>
          {menu.map(([key, label]) =>
            key === 'chats' ? (
              <Link key={key} to="/chats">
                {label}
              </Link>
            ) : (
              <button
                key={key}
                type="button"
                className={tab === key ? styles.on : ''}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            )
          )}
        </nav>
        <Link to="/login" className={styles.logout}>
          Вийти
        </Link>
      </aside>
      <main className={styles.main}>{content}</main>
    </div>
  );
}
