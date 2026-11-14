import Button from './Button.jsx';
import styles from './Status.module.css';

// Показує «Завантаження…» або помилку, інакше — вміст
export default function Status({ loading, error, onRetry, children }) {
  if (loading) {
    return (
      <p className={styles.msg} role="status">
        Завантаження…
      </p>
    );
  }
  if (error) {
    return (
      <div className={styles.error} role="alert">
        <p>{error.message}</p>
        {onRetry && <Button onClick={onRetry}>Спробувати ще раз</Button>}
      </div>
    );
  }
  return children;
}
