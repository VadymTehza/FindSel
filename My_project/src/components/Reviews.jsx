import { useState } from 'react';
import Button from './Button.jsx';
import { sampleReviews } from '../data/reviews.js';
import styles from './Reviews.module.css';

const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function Reviews({ rating, count }) {
  const [list, setList] = useState(sampleReviews);
  const [value, setValue] = useState(0);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!value) return setError('Оберіть оцінку від 1 до 5');
    if (text.trim().length < 5) return setError('Напишіть кілька слів про товар');
    setList((prev) => [
      {
        id: String(Date.now()),
        author: 'Ви',
        stars: value,
        text: text.trim(),
        date: new Date().toLocaleDateString('uk-UA'),
      },
      ...prev,
    ]);
    setValue(0);
    setText('');
    setError('');
  };

  const total = count + list.length - sampleReviews.length;

  return (
    <div>
      <p className={styles.summary}>
        <strong>★ {rating}</strong> · {total} відгуків
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
        {error && (
          <small role="alert" className={styles.err}>
            {error}
          </small>
        )}
        <Button variant="primary" type="submit">
          Надіслати відгук
        </Button>
      </form>
    </div>
  );
}
