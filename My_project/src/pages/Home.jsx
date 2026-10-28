import { useState } from 'react';
import CatalogDrawer from '../components/CatalogDrawer.jsx';
import Header from '../components/Header.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SupportSection from '../components/SupportSection.jsx';
import { categories } from '../data/categories.js';
import { catalog } from '../data/products.js';
import styles from './Home.module.css';

const NO_FILTER = { category: null, sub: null };

export default function Home() {
  const [filter, setFilter] = useState(NO_FILTER);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const items = catalog.filter(
    (p) =>
      (!filter.category || p.category === filter.category) &&
      (!filter.sub || p.sub === filter.sub)
  );
  const category = categories.find((c) => c.id === filter.category);

  const select = (next) => {
    setFilter(next);
    setDrawerOpen(false);
  };

  return (
    <>
      <Header />
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
          {category && (
            <span className={styles.chip}>
              {category.name}
              {filter.sub && filter.sub !== category.name && ` / ${filter.sub}`}
              <button
                type="button"
                aria-label="Скинути фільтр"
                onClick={() => setFilter(NO_FILTER)}
              >
                ×
              </button>
            </span>
          )}
          <span className={styles.count}>Оголошень: {items.length}</span>
        </div>
      </div>

      <main className={styles.grid}>
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {items.length === 0 && (
          <p className={styles.empty}>У цій категорії поки немає оголошень.</p>
        )}
      </main>

      <SupportSection />

      {drawerOpen && (
        <CatalogDrawer
          active={filter}
          onSelect={select}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}
