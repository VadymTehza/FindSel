import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reviews from '../components/Reviews.jsx';
import { catalog, products } from '../data/products.js';
import NotFound from './NotFound.jsx';
import styles from './Product.module.css';

export default function Product() {
  const { id } = useParams();
  const product = catalog.find((p) => String(p.id) === id);

  if (!product) return <NotFound />;

  return (
    <main className={styles.page}>
      <nav className={styles.crumbs} aria-label="Навігація">
        <Link to="/">Головна</Link> / {product.title}
      </nav>

      <section className={styles.top}>
        <div className={styles.gallery}>
          <img className={styles.photo} src={product.image} alt={product.title} />
        </div>

        <div className={styles.info}>
          <h1>{product.title}</h1>
          <p className={styles.rating}>★ 4.9 (180 відгуків)</p>
          <p className={styles.price}>{product.price}</p>
          <p className={styles.meta}>
            <span className={styles.badge}>Активне</span>
            Київ · Опубліковано 2 години тому
          </p>
          <span className={styles.delivery}>Доступна FindGo-доставка</span>

          <div className={styles.seller}>
            <span className={styles.avatar} aria-hidden>
              І
            </span>
            <div className={styles.sellerBody}>
              <strong>Ім’я</strong>
              <small>★ 4.9 · Продавець</small>
              <div className={styles.sellerBtns}>
                <Button variant="primary" to="/chats">
                  Написати
                </Button>
                <Button>Подзвонити</Button>
              </div>
            </div>
          </div>

          <div className={styles.cta}>
            <Button variant="green" full to="/cart">
              Купити з доставкою
            </Button>
            <Button full to="/cart">
              Додати в кошик
            </Button>
            <div className={styles.row}>
              <Button full>Задати питання</Button>
              <FavoriteButton />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.block}>
        <h2>Опис</h2>
        <div className={styles.box}>
          <p>
            Товар у хорошому стані, повний комплект. Детальний опис і фото
            додає продавець.
          </p>
          <dl className={styles.specs}>
            <div>
              <dt>Стан</dt>
              <dd>Вживане</dd>
            </div>
            <div>
              <dt>Місто</dt>
              <dd>Київ</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.block}>
        <h2>Відгуки</h2>
        <Reviews />
      </section>

      <section className={styles.block}>
        <h2>Схожі товари</h2>
        <div className={styles.similar}>
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 3)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </main>
  );
}
