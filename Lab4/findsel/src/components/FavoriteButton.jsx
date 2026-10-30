import { useState } from 'react';
import styles from './FavoriteButton.module.css';

// Лише візуальний стан: сердечко червоніє по кліку
export default function FavoriteButton({ defaultLiked = false, className = '' }) {
  const [liked, setLiked] = useState(defaultLiked);
  return (
    <button
      type="button"
      className={`${styles.btn} ${liked ? styles.liked : ''} ${className}`}
      aria-pressed={liked}
      aria-label={liked ? 'Прибрати з обраного' : 'Додати в обране'}
      onClick={() => setLiked((v) => !v)}
    >
      {liked ? '♥' : '♡'}
    </button>
  );
}
