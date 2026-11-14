import { useState } from 'react';
import { useStartChat } from '../hooks/useStartChat.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AskSellerDialog from '../components/AskSellerDialog.jsx';
import Button from '../components/Button.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reviews from '../components/Reviews.jsx';
import Status from '../components/Status.jsx';
import { useCart } from '../context/useCart.js';
import { categories } from '../data/categories.js';
import { useFavoriteToggle } from '../hooks/useFavoriteToggle.js';
import { useFetch } from '../hooks/useFetch.js';
import { formatPrice } from '../utils/formatPrice.js';
import NotFound from './NotFound.jsx';
import styles from './Product.module.css';

const FALLBACK = 'https://picsum.photos/seed/findsel/700/500';

function ProductBody({ product }) {
  const navigate = useNavigate();
  const { isInCart, add } = useCart();
  const { liked, onToggle } = useFavoriteToggle(product.id);
  const { start: startChat, error: chatError } = useStartChat();
  const [showPhone, setShowPhone] = useState(false);
  const [asking, setAsking] = useState(false);
  const [notice, setNotice] = useState('');

  const inCart = isInCart(product.id);
  const category = categories.find((c) => c.id === product.category);
  const { data: similar } = useFetch(`/products?category=${product.category}`);
  const others = (similar ?? []).filter((p) => p.id !== product.id).slice(0, 4);
  const phone = product.seller.phone;

  const buyNow = () => {
    add(product);
    navigate('/cart');
  };

  return (
    <>
      <nav className={styles.crumbs} aria-label="Навігація">
        <Link to="/">Головна</Link> / {category?.name} / {product.sub}
      </nav>

      <section className={styles.top}>
        <div className={styles.gallery}>
          <img
            className={styles.photo}
            src={product.image}
            alt={product.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK;
            }}
          />
        </div>

        <div className={styles.info}>
          <h1>{product.title}</h1>
          <p className={styles.rating}>
            ★ {product.rating} ({product.reviews} відгуків)
          </p>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={styles.meta}>
            <span className={styles.badge}>
              {product.status === 'active' ? 'Активне' : 'Неактивне'}
            </span>
            {product.city} · Опубліковано {product.posted}
          </p>
          <span className={styles.delivery}>Доступна FindGo-доставка</span>

          <div className={styles.seller}>
            <span className={styles.avatar} aria-hidden>
              {product.seller.name.charAt(0).toUpperCase()}
            </span>
            <div className={styles.sellerBody}>
              <strong>{product.seller.name}</strong>
              <small>★ {product.seller.rating} · Продавець</small>
              <div className={styles.sellerBtns}>
                <Button variant="primary" onClick={() => startChat(product.id)}>
                  Написати
                </Button>
                <Button onClick={() => setShowPhone((v) => !v)}>
                  {showPhone ? phone || 'Номер не вказано' : 'Подзвонити'}
                </Button>
              </div>
            </div>
          </div>

          <div className={styles.cta}>
            <Button variant="green" full onClick={buyNow}>
              Купити з доставкою
            </Button>
            <Button full onClick={() => (inCart ? navigate('/cart') : add(product))}>
              {inCart ? 'В кошику ✓ Перейти' : 'Додати в кошик'}
            </Button>
            <div className={styles.row}>
              <Button full onClick={() => setAsking(true)}>
                Задати питання
              </Button>
              <Button full aria-pressed={liked} onClick={onToggle}>
                {liked ? '♥ В обраному' : '♡ В обране'}
              </Button>
            </div>
          </div>
          {chatError && (
            <p role="alert" className={styles.error}>
              {chatError}
            </p>
          )}
          {notice && (
            <p role="status" className={styles.notice}>
              {notice}
            </p>
          )}
        </div>
      </section>

      <section className={styles.block}>
        <h2>Опис</h2>
        <div className={styles.box}>
          <p>{product.description || 'Продавець не додав опис.'}</p>
          <dl className={styles.specs}>
            <div><dt>Категорія</dt><dd>{category?.name}</dd></div>
            <div><dt>Підкатегорія</dt><dd>{product.sub || '—'}</dd></div>
            <div><dt>Стан</dt><dd>{product.condition}</dd></div>
            <div><dt>Місто</dt><dd>{product.city}</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.block}>
        <h2>Відгуки</h2>
        <Reviews productId={product.id} />
      </section>

      <section className={styles.block}>
        <h2>Схожі товари</h2>
        {others.length === 0 ? (
          <p>Схожих товарів поки немає.</p>
        ) : (
          <div className={styles.similar}>
            {others.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {asking && (
        <AskSellerDialog
          product={product}
          onClose={() => setAsking(false)}
          onSent={() => {
            setAsking(false);
            setNotice('Питання надіслано продавцю.');
          }}
        />
      )}
    </>
  );
}

export default function Product() {
  const { id } = useParams();
  const { data: product, loading, error, refetch } = useFetch(`/products/${id}`);

  if (error?.status === 404) return <NotFound />;

  return (
    <main className={styles.page}>
      <Status loading={loading} error={error} onRetry={refetch}>
        {product && <ProductBody key={product.id} product={product} />}
      </Status>
    </main>
  );
}
