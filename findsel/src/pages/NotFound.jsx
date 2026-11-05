import Button from '../components/Button.jsx';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <p className={styles.code}>404</p>
      <h1>Сторінку не знайдено</h1>
      <p>Можливо, адресу введено з помилкою або сторінку видалено.</p>
      <Button variant="green" to="/">
        На головну
      </Button>
    </main>
  );
}
