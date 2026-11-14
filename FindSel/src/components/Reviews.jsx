import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { useFetch } from '../hooks/useFetch.js';
import { usePost } from '../hooks/useMutation.js';
import Button from './Button.jsx';
import Status from './Status.jsx';
import styles from './Reviews.module.css';

const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function Reviews({ productId }) {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useFetch(`/products/${productId}/reviews`);
  const post = usePost();
  const [value, setValue] = useState(0);
  const [text, setText] = useState('');
  const [formError, setFormError] = useState('');

  const list = data ?? [];
  const average = list.length
    ? (list.reduce((s, r) => s + r.stars, 0) / list.length).toFixed(1)
    : '—';

  const submit = async (e) => {
    e.preventDefault();
    if (!value) return setFormError('Оберіть оцінку від 1 до 5');
    if (text.trim().length < 5) return setFormError('Напишіть кілька слів про товар');
    setFormError('');
    try {
      await post.run(`/products/${productId}/reviews`, { stars: value, text });
      setValue(0);
      setText('');
      refetch();
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div>
      <Status loading={loading} error={error} onRetry={refetch}>
        <p className={styles.summary}>
          <strong>★ {average}</strong> · {list.length} відгуків
        </p>
        <ul className={styles.list}>
          {list.map((r) => (
            <li key={r.id} className={styles.item}>
              <div className={styles.top}>
                <strong>{r.author}</strong>
                <span className={styles.stars} aria-label={`Оцінка ${r.stars} з 5`}>
                  {stars(r.stars)}
                </span>
                <time>{r.date}</time>
              </div>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      </Status>

      {user ? (
        <form className={styles.form} onSubmit={submit} noValidate>
          <h3>Залишити відгук</h3>
          <div className={styles.pick} role="radiogroup" aria-label="Оцінка">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={value === n}
                aria-label={`${n} з 5`}
                className={n <= value ? styles.on : ''}
                onClick={() => setValue(n)}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ваш відгук"
            aria-label="Текст відгуку"
          />
          {formError && (
            <small role="alert" className={styles.err}>
              {formError}
            </small>
          )}
          <Button variant="primary" type="submit" disabled={post.loading}>
            Надіслати відгук
          </Button>
        </form>
      ) : (
        <p>
          <Link to="/login">Увійдіть</Link>, щоб залишити відгук.
        </p>
      )}
    </div>
  );
}
