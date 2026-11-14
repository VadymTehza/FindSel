import { useFetch } from '../hooks/useFetch.js';
import { useStartChat } from '../hooks/useStartChat.js';
import { formatPrice } from '../utils/formatPrice.js';
import Button from './Button.jsx';
import Status from './Status.jsx';
import styles from './MyPurchases.module.css';

export default function MyPurchases() {
  const { data, loading, error, refetch } = useFetch('/orders');
  const orders = data ?? [];
  const { start } = useStartChat();

  return (
    <>
      <h1>Мої покупки</h1>
      <Status loading={loading} error={error} onRetry={refetch}>
        {orders.length === 0 ? (
          <div className={styles.empty}>
            <p>Замовлень поки немає.</p>
            <Button variant="green" to="/">
              До каталогу
            </Button>
          </div>
        ) : (
          <div className={styles.list}>
            {orders.map((o) => (
              <article key={o.id} className={styles.order}>
                <header className={styles.head}>
                  <strong>Замовлення №{o.id}</strong>
                  <span>{new Date(o.createdAt).toLocaleDateString('uk-UA')}</span>
                  <span className={styles.status}>{o.status}</span>
                </header>
                <ul className={styles.items}>
                  {o.items.map((it) => (
                    <li key={it.productId}>
                      <img src={it.image} alt="" />
                      <span>
                        {it.title} × {it.qty}
                      </span>
                      <b>{formatPrice(it.price * it.qty)}</b>
                    </li>
                  ))}
                </ul>
                <p className={styles.meta}>
                  FindGo-доставка · {o.address.city}, відділення {o.address.branch} · ТТН: {o.ttn}
                </p>
                <footer className={styles.foot}>
                  <strong>Разом: {formatPrice(o.total)}</strong>
                  <Button onClick={() => start(o.items[0].productId)}>Чат з продавцем</Button>
                </footer>
              </article>
            ))}
          </div>
        )}
      </Status>
    </>
  );
}
