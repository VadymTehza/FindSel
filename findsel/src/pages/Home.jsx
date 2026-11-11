import { useState } from 'react';
import CatalogDrawer from '../components/CatalogDrawer.jsx';
import Header from '../components/Header.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SupportSection from '../components/SupportSection.jsx';
import { products } from '../data/products.js';
import styles from './Home.module.css';

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        </div>
      </div>

      <main className={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </main>

      <SupportSection />

      {drawerOpen && <CatalogDrawer onClose={() => setDrawerOpen(false)} />}
    </>
  );
}
