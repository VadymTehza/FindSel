import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AskSellerDialog from '../components/AskSellerDialog.jsx';
import Button from '../components/Button.jsx';
import Header from '../components/Header.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reviews from '../components/Reviews.jsx';
import { categories } from '../data/categories.js';
import { catalog } from '../data/products.js';
import { useCart } from '../context/useCart.js';
import { useFavorites } from '../context/useFavorites.js';
import { formatPrice } from '../utils/formatPrice.js';
import styles from './Product.module.css';

const FALLBACK = 'https://picsum.photos/seed/smartmarket/700/500';

function ProductView({ product }) {
  const navigate = useNavigate();
  const { isFavorite, toggle } = useFavorites();
  const { isInCart, add } = useCart();
  const [photo, setPhoto] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [asking, setAsking] = useState(false);
  const [notice, setNotice] = useState('');

  const photos = product.images ?? [product.image];
  const liked = isFavorite(product.id);
  const inCart = isInCart(product.id);
  const category = categories.find((c) => c.id === product.category);
  const similar = catalog
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const phone = product.seller.phone;
  const masked = `${phone.slice(0, 7)} ••• •• ••`;

  const buyNow = () => {
    add(product.id);
    navigate('/cart');
  };

  return (
    <main className={styles.page}>
      <nav className={styles.crumbs} aria-label="Навігація">
        <Link to="/">Головна</Link> / {category?.name} / {product.sub}
      </nav>

      <section className={styles.top}>
        <div className={styles.gallery}>
          <img
            className={styles.photo}
            src={photos[photo]}
            alt={product.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK;
            }}
          />
          {photos.length > 1 && (
            <div className={styles.thumbs}>
              {photos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Фото ${i + 1}`}
                  aria-pressed={i === photo}
                  onClick={() => setPhoto(i)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <h1>{product.title}</h1>
          <p className={styles.rating}>
            ★ {product.rating} ({product.reviews} відгуків)
          </p>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={styles.meta}>
            <span className={styles.badge}>Активне</span>
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
                <Link to="/chats">
                  <Button variant="primary">Написати</Button>
                </Link>
                <Button onClick={() => setShowPhone((v) => !v)}>
                  {showPhone ? phone : 'Подзвонити'}
                </Button>
              </div>
              {showPhone ? null : <small className={styles.mask}>{masked}</small>}
            </div>
          </div>

          <div className={styles.cta}>
            <Button variant="green" full onClick={buyNow}>
              Купити з доставкою
            </Button>
            <Button
              full
              onClick={() => (inCart ? navigate('/cart') : add(product.id))}
            >
              {inCart ? 'В кошику ✓ Перейти' : 'Додати в кошик'}
            </Button>
            <div className={styles.row}>
              <Button full onClick={() => setAsking(true)}>
                Задати питання
              </Button>
              <Button
                full
                aria-pressed={liked}
                onClick={() => toggle(product.id)}
              >
                {liked ? '♥ В обраному' : '♡ В обране'}
              </Button>
            </div>
          </div>
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
          <p>{product.description}</p>
          <dl className={styles.specs}>
            <div><dt>Категорія</dt><dd>{category?.name}</dd></div>
            <div><dt>Підкатегорія</dt><dd>{product.sub}</dd></div>
            <div><dt>Стан</dt><dd>{product.condition}</dd></div>
            <div><dt>Місто</dt><dd>{product.city}</dd></div>
          </dl>
        </div>
      </section>

      <section className={styles.block}>
        <h2>Відгуки</h2>
        <Reviews rating={product.rating} count={product.reviews} />
      </section>

      <section className={styles.block}>
        <h2>Схожі товари</h2>
        {similar.length === 0 ? (
          <p>Схожих товарів поки немає.</p>
        ) : (
          <div className={styles.similar}>
            {similar.map((p) => (
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
            setNotice('Питання надіслано продавцю. Відповідь з’явиться в чаті.');
          }}
        />
      )}
    </main>
  );
}

export default function Product() {
  const { id } = useParams();
  const product = catalog.find((p) => String(p.id) === id);

  return (
    <>
      <Header />
      {product ? (
        <ProductView key={product.id} product={product} />
      ) : (
        <main className={styles.page}>
          <div className={styles.notFound}>
            <h1>Товар не знайдено</h1>
            <p>Можливо, оголошення вже видалено.</p>
            <Link to="/">
              <Button variant="green">До каталогу</Button>
            </Link>
          </div>
        </main>
      )}
    </>
  );
}
