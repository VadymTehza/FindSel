import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Header from '../components/Header.jsx';
import { useCart } from '../context/useCart.js';
import { MAX_QTY, getTotals } from '../utils/cartTotals.js';
import { formatPrice } from '../utils/formatPrice.js';
import styles from './Cart.module.css';

export default function Cart() {
  const {
    lines,
    count,
    subtotal,
    promo,
    setQty,
    remove,
    clear,
    applyPromo,
    removePromo,
  } = useCart();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [agree, setAgree] = useState(true);
  const totals = getTotals(subtotal, promo);

  const submitPromo = (e) => {
    e.preventDefault();
    if (applyPromo(code)) {
      setPromoError('');
      setCode('');
    } else {
      setPromoError('Такого промокоду не існує');
    }
  };

  return (
    <>
      <Header />
      <div className={styles.bg}>
        <main className={styles.page}>
          <h1 className={styles.title}>🛒 Кошик({count})</h1>

          {lines.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Кошик порожній</p>
              <p>Додайте товари з каталогу, і вони з’являться тут.</p>
              <Link to="/">
                <Button variant="green">До каталогу</Button>
              </Link>
            </div>
          ) : (
            <div className={styles.layout}>
              <section className={styles.items} aria-label="Товари в кошику">
                {lines.map((l) => (
                  <article key={l.id} className={styles.item}>
                    <img src={l.image} alt={l.title} />
                    <div className={styles.body}>
                      <h2>
                        <Link to={`/product/${l.id}`}>{l.title}</Link>
                      </h2>
                      {l.rating && (
                        <p>
                          ⭐ {l.rating}({l.reviews})
                        </p>
                      )}
                      <div className={styles.qty}>
                        <button
                          type="button"
                          onClick={() => setQty(l.id, l.qty - 1)}
                          disabled={l.qty <= 1}
                          aria-label="Зменшити кількість"
                        >
                          -
                        </button>
                        <span aria-live="polite">{l.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(l.id, l.qty + 1)}
                          disabled={l.qty >= MAX_QTY}
                          aria-label="Збільшити кількість"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className={styles.side}>
                      <strong>{formatPrice(l.price * l.qty)}</strong>
                      {l.qty > 1 && (
                        <small>{formatPrice(l.price)} за шт.</small>
                      )}
                      <button
                        type="button"
                        className={styles.trash}
                        onClick={() => remove(l.id)}
                        aria-label={`Видалити ${l.title}`}
                      >
                        🗑
                      </button>
                    </div>
                  </article>
                ))}
                <button type="button" className={styles.clear} onClick={clear}>
                  Очистити кошик
                </button>
              </section>

              <aside className={styles.summary}>
                <h2>Підсумок замовлення</h2>
                <dl>
                  <div>
                    <dt>Товари({count})</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  <div>
                    <dt>Доставка(Нова пошта)</dt>
                    <dd>{formatPrice(totals.delivery)}</dd>
                  </div>
                  <div>
                    <dt>Комісія FindGo-доставка</dt>
                    <dd>{formatPrice(totals.commission)}</dd>
                  </div>
                  {promo && (
                    <div>
                      <dt>Промокод</dt>
                      <dd>-{formatPrice(totals.discount)}</dd>
                    </div>
                  )}
                </dl>

                {promo ? (
                  <p className={styles.promoOk}>
                    Промокод застосовано{' '}
                    <button type="button" onClick={removePromo}>
                      Прибрати
                    </button>
                  </p>
                ) : (
                  <form className={styles.promo} onSubmit={submitPromo}>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Промокод (наприклад, FIND50)"
                      aria-label="Промокод"
                    />
                    <Button type="submit" disabled={!code.trim()}>
                      Застосувати
                    </Button>
                    {promoError && <small role="alert">{promoError}</small>}
                  </form>
                )}

                <p className={styles.total}>
                  <span>Ціна:</span>
                  <strong>{formatPrice(totals.total)}</strong>
                </p>
                <Button
                  variant="green"
                  full
                  disabled={!agree}
                  onClick={() => navigate('/checkout')}
                >
                  Перейти до оформлення
                </Button>
                <label className={styles.agree}>
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />{' '}
                  Погоджуюся з умовами та FindGo-доставкою
                </label>
              </aside>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
