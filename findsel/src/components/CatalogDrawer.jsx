import { useEffect, useId, useRef } from 'react';
import { categories } from '../data/categories.js';
import styles from './CatalogDrawer.module.css';

export default function CatalogDrawer({ onClose }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const closeOnBackdrop = (e) => {
    if (e.target === ref.current) onClose();
  };

  return (
    <dialog
      ref={ref}
      className={styles.drawer}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      <div className={styles.panel}>
        <header className={styles.head}>
          <h2 id={titleId}>Каталог</h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрити каталог"
          >
            ×
          </button>
        </header>
        <nav aria-label="Категорії">
          <ul className={styles.list}>
            {categories.map((c) => (
              <li key={c.id}>
                <div className={styles.cat}>
                  <span aria-hidden>{c.icon}</span>
                  <span className={styles.name}>{c.name}</span>
                </div>
                <ul className={styles.sub}>
                  {c.sub.map((s) => (
                    <li key={s}>
                      <button type="button" onClick={onClose}>
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </dialog>
  );
}
