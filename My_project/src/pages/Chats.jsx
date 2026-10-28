import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { chats as initialChats } from '../data/chats.js';
import { laptop } from '../data/products.js';
import styles from './Chats.module.css';

const initial = (name) => name.trim().charAt(0).toUpperCase();

export default function Chats() {
  const [chats, setChats] = useState(initialChats);
  const [activeId, setActiveId] = useState(initialChats[0].id);
  const [opened, setOpened] = useState(false); // для мобільного перегляду
  const [text, setText] = useState('');
  const endRef = useRef(null);

  const active = chats.find((c) => c.id === activeId);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [activeId, active.messages.length]);

  const select = (id) => {
    setActiveId(id);
    setOpened(true);
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const send = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    const msg = { id: Date.now(), from: 'me', text: value, time: 'Зараз' };
    setChats((prev) => prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, msg], time: 'Зараз' } : c)));
    setText('');
  };

  return (
    <>
      <Header />
      <main className={`${styles.page} ${opened ? styles.opened : ''}`}>
        <aside className={styles.list} aria-label="Список чатів">
          <h1 className={styles.title}>Чати</h1>
          <ul>
            {chats.map((c) => {
              const last = c.messages[c.messages.length - 1];
              return (
                <li key={c.id}>
                  <button className={`${styles.item} ${c.id === activeId ? styles.current : ''}`} onClick={() => select(c.id)}>
                    <span className={styles.avatar} style={{ background: c.color }}>{initial(c.name)}</span>
                    <span className={styles.meta}>
                      <span className={styles.row}><strong>{c.name}</strong><time>{c.time}</time></span>
                      <span className={styles.about}>{c.product.title}</span>
                      <span className={styles.row}>
                        <span className={styles.preview}>{last.from === 'me' ? 'Ви: ' : ''}{last.text}</span>
                        {c.unread > 0 && <span className={styles.badge}>{c.unread}</span>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className={styles.dialog} aria-label={`Чат з ${active.name}`}>
          <header className={styles.head}>
            <button className={styles.back} onClick={() => setOpened(false)} aria-label="Назад до чатів">←</button>
            <span className={styles.avatar} style={{ background: active.color }}>{initial(active.name)}</span>
            <div>
              <strong>{active.name}</strong>
              <small>Продавець</small>
            </div>
          </header>

          <Link to="/product/10" className={styles.product}>
            <img src={laptop.image} alt="" />
            <span><strong>{active.product.title}</strong><small>{active.product.price}</small></span>
            <span className={styles.open}>Відкрити</span>
          </Link>

          <ol className={styles.messages}>
            {active.messages.map((m) => (
              <li key={m.id} className={`${styles.msg} ${m.from === 'me' ? styles.me : styles.them}`}>
                <p>{m.text}</p>
                <time>{m.time}</time>
              </li>
            ))}
            <li ref={endRef} aria-hidden />
          </ol>

          <form className={styles.compose} onSubmit={send}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Напишіть повідомлення" aria-label="Повідомлення" />
            <button type="submit" disabled={!text.trim()}>Надіслати</button>
          </form>
        </section>
      </main>
    </>
  );
}
