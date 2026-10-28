import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart.js';
import { formatPrice } from '../utils/formatPrice.js';
import FavoriteButton from './FavoriteButton.jsx';
import styles from './ProductCard.module.css';

const FALLBACK = 'https://picsum.photos/seed/smartmarket/600/400';

export default function ProductCard({ product }) {
  const { isInCart, add } = useCart();

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`}>
        <img
          className={styles.img}
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK;
          }}
        />
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <h3 className={styles.title}>{product.title}</h3>
      </Link>
      {isInCart(product.id) ? (
        <Link to="/cart" className={`${styles.cartBtn} ${styles.inCart}`}>
          В кошику ✓
        </Link>
      ) : (
        <button
          type="button"
          className={styles.cartBtn}
          onClick={() => add(product.id)}
        >
          У кошик
        </button>
      )}
      <FavoriteButton id={product.id} className={styles.fav} />
    </article>
  );
}
