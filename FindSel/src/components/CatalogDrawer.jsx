import { useEffect, useId, useRef, useState } from 'react';
import { categories } from '../data/categories.js';
import styles from './CatalogDrawer.module.css';

export default function CatalogDrawer({ active, onSelect, onClose }) {
  const ref = useRef(null);
  const titleId = useId();
  const [openId, setOpenId] = useState(active.category);

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
          <button type="button" className={styles.close} onClick={onClose} aria-label="Закрити каталог">
            ×
          </button>
        </header>
        <nav aria-label="Категорії">
          <button
            type="button"
            className={`${styles.all} ${!active.category ? styles.current : ''}`}
            onClick={() => onSelect({ category: null, sub: null })}
          >
            Усі оголошення
          </button>
          <ul className={styles.list}>
            {categories.map((c) => {
              const open = openId === c.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    className={styles.cat}
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : c.id)}
                  >
                    <span aria-hidden>{c.icon}</span>
                    <span className={styles.name}>{c.name}</span>
                    <span aria-hidden>{open ? '▾' : '▸'}</span>
                  </button>
                  {open && (
                    <ul className={styles.sub}>
                      <li>
                        <button type="button" onClick={() => onSelect({ category: c.id, sub: null })}>
                          Усе в «{c.name}»
                        </button>
                      </li>
                      {c.sub.map((s) => (
                        <li key={s}>
                          <button
                            type="button"
                            className={active.category === c.id && active.sub === s ? styles.current : ''}
                            onClick={() => onSelect({ category: c.id, sub: s })}
                          >
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </dialog>
  );
}
