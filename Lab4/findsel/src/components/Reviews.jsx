import styles from './Reviews.module.css';

const REVIEWS = [
  { id: 1, author: 'Ірина М.', stars: '★★★★★', text: 'Все як в описі, продавець швидко відповідає. Рекомендую!', date: '12.10.2026' },
  { id: 2, author: 'Олег П.', stars: '★★★★☆', text: 'Товар гарний, є невеликі сліди використання, але ціна справедлива.', date: '03.10.2026' },
];

export default function Reviews() {
  return (
    <div>
      <p className={styles.summary}>
        <strong>★ 4.9</strong> · 180 відгуків
      </p>
      <ul className={styles.list}>
        {REVIEWS.map((r) => (
          <li key={r.id} className={styles.item}>
            <div className={styles.top}>
              <strong>{r.author}</strong>
              <span className={styles.stars}>{r.stars}</span>
              <time>{r.date}</time>
            </div>
            <p>{r.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
