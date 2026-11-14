import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CatalogDrawer from '../components/CatalogDrawer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Status from '../components/Status.jsx';
import SupportSection from '../components/SupportSection.jsx';
import { categories } from '../data/categories.js';
import { useFetch } from '../hooks/useFetch.js';
import styles from './Home.module.css';

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const category = params.get('category');
  const sub = params.get('sub');
  const q = params.get('q');

  const query = new URLSearchParams();
  if (category) query.set('category', category);
  if (sub) query.set('sub', sub);
  if (q) query.set('q', q);
  const qs = query.toString();

  const { data, loading, error, refetch } = useFetch(`/products${qs ? `?${qs}` : ''}`);
  const items = data ?? [];
  const categoryInfo = categories.find((c) => c.id === category);

  const updateParams = (change) => {
    const next = new URLSearchParams(params);
    change(next);
    setParams(next);
  };
  const select = ({ category: c, sub: s }) => {
    updateParams((n) => {
      n.delete('category');
      n.delete('sub');
      if (c) n.set('category', c);
      if (s) n.set('sub', s);
    });
    setDrawerOpen(false);
  };
  const clear = (...keys) => updateParams((n) => keys.forEach((k) => n.delete(k)));

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.catalogBtn}
            aria-haspopup="dialog"
            onClick={() => setDrawerOpen(true)}
          >
            <span aria-hidden>☰</span> Каталог
          </button>
          {categoryInfo && (
            <span className={styles.chip}>
              {categoryInfo.name}
              {sub && ` / ${sub}`}
              <button type="button" aria-label="Скинути категорію" onClick={() => clear('category', 'sub')}>
                ×
              </button>
            </span>
          )}
          {q && (
            <span className={styles.chip}>
              Пошук: {q}
              <button type="button" aria-label="Скинути пошук" onClick={() => clear('q')}>
                ×
              </button>
            </span>
          )}
          {!loading && !error && <span className={styles.count}>Оголошень: {items.length}</span>}
        </div>
      </div>

      <main className={styles.grid}>
        <Status loading={loading} error={error} onRetry={refetch}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {items.length === 0 && <p className={styles.empty}>Нічого не знайдено.</p>}
        </Status>
      </main>

      <SupportSection />

      {drawerOpen && (
        <CatalogDrawer
          active={{ category, sub }}
          onSelect={select}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}
