import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Status from '../components/Status.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { usePost } from '../hooks/useMutation.js';
import { formatPrice } from '../utils/formatPrice.js';
import styles from './Chats.module.css';

const time = (iso) =>
  new Date(iso).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
const shortDate = (iso) => {
  const d = new Date(iso);
  return d.toDateString() === new Date().toDateString() ? time(iso) : d.toLocaleDateString('uk-UA');
};
const tone = (id) => styles[`c${(id % 3) + 1}`];

function Dialog({ chat, onSent }) {
  const msgs = useFetch(`/chats/${chat.id}/messages`, { interval: 3000 });
  const send = usePost();
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const messages = msgs.data ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  const submit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    try {
      await send.run(`/chats/${chat.id}/messages`, { text: value });
      setText('');
      msgs.refetch();
      onSent();
    } catch {
      // текст помилки показуємо нижче (send.error)
    }
  };

  return (
    <section className={styles.dialog} aria-label={`Чат з ${chat.partner}`}>
      <header className={styles.head}>
        <span className={`${styles.avatar} ${tone(chat.id)}`}>{chat.partner.charAt(0).toUpperCase()}</span>
        <div>
          <strong>{chat.partner}</strong>
          <small>{chat.partnerRole}</small>
        </div>
      </header>

      {chat.product && (
        <Link to={`/product/${chat.productId}`} className={styles.product}>
          <img src={chat.product.image} alt="" />
          <span>
            <strong>{chat.product.title}</strong>
            <small>{formatPrice(chat.product.price)}</small>
          </span>
        </Link>
      )}

      <div className={styles.messages}>
        <Status loading={msgs.loading && !msgs.data} error={msgs.error} onRetry={msgs.refetch}>
          {messages.length === 0 && <p className={styles.hint}>Повідомлень поки немає. Напишіть перше!</p>}
          <ol className={styles.thread}>
            {messages.map((m) => (
              <li key={m.id} className={`${styles.msg} ${m.fromMe ? styles.me : styles.them}`}>
                <p>{m.text}</p>
                <time>{time(m.createdAt)}</time>
              </li>
            ))}
            <li ref={endRef} aria-hidden />
          </ol>
        </Status>
      </div>

      {send.error && (
        <p role="alert" className={styles.alert}>
          {send.error.message}
        </p>
      )}
      <form className={styles.compose} onSubmit={submit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Напишіть повідомлення" aria-label="Повідомлення" maxLength={1000} />
        <button type="submit" disabled={!text.trim() || send.loading}>
          Надіслати
        </button>
      </form>
    </section>
  );
}

export default function Chats() {
  const [params, setParams] = useSearchParams();
  const list = useFetch('/chats', { interval: 5000 });
  const chats = list.data ?? [];
  const activeId = Number(params.get('chat')) || chats[0]?.id || null;
  const active = chats.find((c) => c.id === activeId) ?? null;

  return (
    <main className={styles.page}>
      <aside className={styles.list} aria-label="Список чатів">
        <h1 className={styles.title}>Чати</h1>
        <Status loading={list.loading && !list.data} error={list.error} onRetry={list.refetch}>
          {chats.length === 0 && (
            <p className={styles.hint}>
              Чатів поки немає. Натисніть «Написати» на сторінці товару, щоб почати розмову з продавцем.
            </p>
          )}
          <ul>
            {chats.map((c) => {
              const unread = c.id === activeId ? 0 : c.unread;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`${styles.item} ${c.id === activeId ? styles.current : ''}`}
                    onClick={() => setParams({ chat: c.id })}
                  >
                    <span className={`${styles.avatar} ${tone(c.id)}`}>{c.partner.charAt(0).toUpperCase()}</span>
                    <span className={styles.meta}>
                      <span className={styles.row}>
                        <strong>{c.partner}</strong>
                        <time>{shortDate(c.updatedAt)}</time>
                      </span>
                      <span className={styles.about}>{c.product?.title}</span>
                      <span className={styles.row}>
                        <span className={styles.preview}>
                          {c.last ? `${c.last.fromMe ? 'Ви: ' : ''}${c.last.text}` : 'Немає повідомлень'}
                        </span>
                        {unread > 0 && <span className={styles.badge}>{unread}</span>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Status>
      </aside>

      {active ? (
        <Dialog key={active.id} chat={active} onSent={list.refetch} />
      ) : (
        <section className={styles.dialog}>
          <p className={styles.hint}>Оберіть чат зі списку.</p>
        </section>
      )}
    </main>
  );
}
