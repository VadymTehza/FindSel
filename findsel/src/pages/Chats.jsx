import Header from '../components/Header.jsx';
import { chats, messages } from '../data/chats.js';
import { laptop } from '../data/products.js';
import styles from './Chats.module.css';

export default function Chats() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <aside className={styles.list} aria-label="Список чатів">
          <h1 className={styles.title}>Чати</h1>
          <ul>
            {chats.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`${styles.item} ${i === 0 ? styles.current : ''}`}
                >
                  <span className={`${styles.avatar} ${styles[c.tone]}`}>
                    {c.name.charAt(0)}
                  </span>
                  <span className={styles.meta}>
                    <span className={styles.row}>
                      <strong>{c.name}</strong>
                      <time>{c.time}</time>
                    </span>
                    <span className={styles.about}>{c.product}</span>
                    <span className={styles.row}>
                      <span className={styles.preview}>{c.last}</span>
                      {c.unread > 0 && (
                        <span className={styles.badge}>{c.unread}</span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className={styles.dialog} aria-label="Чат з Лайк шоп">
          <header className={styles.head}>
            <span className={`${styles.avatar} ${styles.c1}`}>Л</span>
            <div>
              <strong>Лайк шоп</strong>
              <small>Продавець</small>
            </div>
          </header>

          <div className={styles.product}>
            <img src={laptop.image} alt="" />
            <span>
              <strong>{laptop.title}</strong>
              <small>{laptop.price}</small>
            </span>
          </div>

          <ol className={styles.messages}>
            {messages.map((m) => (
              <li
                key={m.id}
                className={`${styles.msg} ${m.from === 'me' ? styles.me : styles.them}`}
              >
                <p>{m.text}</p>
                <time>{m.time}</time>
              </li>
            ))}
          </ol>

          <form className={styles.compose} onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Напишіть повідомлення" aria-label="Повідомлення" />
            <button type="submit">Надіслати</button>
          </form>
        </section>
      </main>
    </>
  );
}
