import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton.jsx';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`}>
        <img
          className={styles.img}
          src={product.image}
          alt={product.title}
          loading="lazy"
        />
        <p className={styles.price}>{product.price}</p>
        <h3 className={styles.title}>{product.title}</h3>
      </Link>
      <Link to="/cart" className={styles.cartBtn}>
        У кошик
      </Link>
      <FavoriteButton className={styles.fav} />
    </article>
  );
}
