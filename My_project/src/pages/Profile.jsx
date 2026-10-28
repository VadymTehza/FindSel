import { useState } from 'react';
import { formatPrice } from '../utils/formatPrice.js';
import { Link, useParams } from 'react-router-dom';
import ListingItem from '../components/ListingItem.jsx';
import FavoritesList from '../components/FavoritesList.jsx';
import MyListings from '../components/MyListings.jsx';
import Settings from '../components/Settings.jsx';
import { initialListings } from '../data/listings.js';
import { laptop } from '../data/products.js';
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

function MyPurchases() {
  return (
    <>
      <h1>Мої покупки</h1>
      <nav className={styles.tabs}>
        <span>В дорозі (1)</span>
        <span>Очікується у відділенні (1)</span>
        <span>Завершені (10)</span>
      </nav>
      <ListingItem
        image={laptop.image}
        title="Ноутбук Asus"
        price={formatPrice(laptop.price)}
        actions={
          <>
            <span>Відстежити</span>
            <Link to="/chats">Чат з продавцем</Link>
          </>
        }
      >
        <span>в дорозі FindGo-доставка</span>
        <small>ТТН:20450893221</small>
      </ListingItem>
    </>
  );
}

export default function Profile() {
  const { role = 'seller' } = useParams();
  const [tab, setTab] = useState('main');
  const [listings, setListings] = useState(initialListings);
  const [profile, setProfile] = useState({
    name: 'Ім’я',
    phone: '+380 50 123 45 67',
    email: 'user@example.com',
  });
  const menu = MENU[role] ?? MENU.seller;

  const updateProfile = (field, value) =>
    setProfile((p) => ({ ...p, [field]: value }));
  const updateListing = (id, patch) =>
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  let content;
  if (tab === 'main') {
    content =
      role === 'buyer' ? (
        <MyPurchases />
      ) : (
        <MyListings listings={listings} onUpdate={updateListing} />
      );
  } else if (tab === 'favorites') {
    content = <FavoritesList />;
  } else if (tab === 'settings') {
    content = <Settings profile={profile} onChange={updateProfile} />;
  } else {
    content = <h1>Розділ у розробці</h1>;
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.avatar} aria-hidden>
          👤
        </div>
        <strong className={styles.name}>{profile.name}</strong>
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
