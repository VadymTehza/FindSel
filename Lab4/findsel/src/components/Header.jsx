import Link from './Link.jsx';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            FindSel
          </Link>
          <input
            className={styles.search}
            type="search"
            placeholder="Пошук"
            aria-label="Пошук"
          />
        </div>
        <div className={styles.right}>
          <nav className={styles.icons} aria-label="Швидкі дії">
            <Link to="/cart" aria-label="Кошик">
              🧺
            </Link>
            <Link to="/chats" aria-label="Чати">
              💬
            </Link>
            <Link to="/profile/seller" aria-label="Обране">
              ♡
            </Link>
            <Link to="/login" aria-label="Увійти">
              👤
            </Link>
          </nav>
          <Link to="/create" className={styles.create}>
            + Створити оголошення
          </Link>
        </div>
      </div>
    </header>
  );
}
