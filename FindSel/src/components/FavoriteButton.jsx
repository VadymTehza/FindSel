import { useFavoriteToggle } from '../hooks/useFavoriteToggle.js';
import styles from './FavoriteButton.module.css';

export default function FavoriteButton({ id, className = '' }) {
  const { liked, onToggle } = useFavoriteToggle(id);
  return (
    <button
      type="button"
      className={`${styles.btn} ${liked ? styles.liked : ''} ${className}`}
      aria-pressed={liked}
      aria-label={liked ? 'Прибрати з обраного' : 'Додати в обране'}
      onClick={onToggle}
    >
      {liked ? '♥' : '♡'}
    </button>
  );
}
