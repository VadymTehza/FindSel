import { useFavorites } from '../context/useFavorites.js';
import styles from './FavoriteButton.module.css';

export default function FavoriteButton({ id, className = '' }) {
  const { isFavorite, toggle } = useFavorites();
  const liked = isFavorite(id);
  return (
    <button
      type="button"
      className={`${styles.btn} ${liked ? styles.liked : ''} ${className}`}
      aria-pressed={liked}
      aria-label={liked ? 'Прибрати з обраного' : 'Додати в обране'}
      onClick={() => toggle(id)}
    >
      {liked ? '♥' : '♡'}
    </button>
  );
}
