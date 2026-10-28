import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { useCart } from '../context/useCart.js';
import { getTotals } from '../utils/cartTotals.js';
import { formatPrice } from '../utils/formatPrice.js';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { lines, subtotal, promo, clear } = useCart();
  const [placed, setPlaced] = useState(false);
  const totals = getTotals(subtotal, promo);

  const placeOrder = () => {
    setPlaced(true);
    clear();
  };

  if (placed) {
    return (
      <main className={styles.page}>
        <div className={styles.done}>
          <h1>Замовлення оформлено</h1>
          <p>Продавець отримав ваше замовлення. Статус можна відстежувати в профілі.</p>
          <div className={styles.doneActions}>
            <Link to="/profile/buyer">
              <Button variant="green">Мої покупки</Button>
            </Link>
            <Link to="/">
              <Button>До каталогу</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.done}>
          <h1>Кошик порожній</h1>
          <p>Додайте товари, щоб оформити замовлення.</p>
          <div className={styles.doneActions}>
            <Link to="/">
              <Button variant="green">До каталогу</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>
        Оформлення замовлення <Link to="/cart" className={styles.back}>← Назад до кошика</Link>
      </h1>
      <div className={styles.layout}>
        <div>
          <section className={styles.section}>
            <h2>
              1. Контактна інформація{' '}
              <a href="#edit" className={styles.edit}>
                ✎ Редагувати
              </a>
            </h2>
            <div className={styles.white}>
              <p>Ім’я: **********</p>
              <p>Номер телефону: ***********</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>2. Спосіб доставки</h2>
            <div className={styles.panel}>
              <p className={styles.smart}>🚚 FindGo-доставка</p>
              <div className={styles.np}>
                <h3>Нова пошта</h3>
                <label>
                  <input type="radio" name="d" defaultChecked /> У відділення
                </label>
                <label>
                  <input type="radio" name="d" /> У поштомат
                </label>
                <label>
                  <input type="radio" name="d" /> Кур’єром
                </label>
                <label className={styles.f}>
                  Місто
                  <input placeholder="******" />
                </label>
                <label className={styles.f}>
                  Відділення
                  <input placeholder="********" />
                </label>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>3. Коментар</h2>
            <textarea
              className={styles.comment}
              rows={4}
              placeholder="Коментар до замовлення"
            />
          </section>
        </div>

        <aside className={styles.summary}>
          <h2>Твоє замовлення</h2>
          <div className={styles.lines}>
            {lines.map((l) => (
              <div key={l.id} className={styles.product}>
                <img src={l.image} alt={l.title} />
                <div>
                  <strong>{l.title}</strong>
                  <p>Кількість: {l.qty}</p>
                </div>
                <strong>{formatPrice(l.price * l.qty)}</strong>
              </div>
            ))}
          </div>
          <h3>4. Спосіб оплати</h3>
          <label className={styles.pay}>
            <input type="radio" name="p" /> Платіжна карта (Visa****)
          </label>
          <label className={styles.pay}>
            <input type="radio" name="p" defaultChecked /> Готівка при отриманні
          </label>
          <label className={styles.pay}>
            <input type="checkbox" defaultChecked /> Погоджуюсь з умовами
          </label>
          <dl>
            <div>
              <dt>Товар(и):</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Доставка:</dt>
              <dd>{formatPrice(totals.delivery)}</dd>
            </div>
            <div>
              <dt>Комісія FindGo:</dt>
              <dd>{formatPrice(totals.commission)}</dd>
            </div>
            <div>
              <dt>Промокод:</dt>
              <dd>{totals.discount ? `-${formatPrice(totals.discount)}` : '0грн'}</dd>
            </div>
          </dl>
          <p className={styles.total}>
            <span>Всього до оплати:</span>
            <strong>{formatPrice(totals.total)}</strong>
          </p>
          <Button variant="green" full onClick={placeOrder}>
            Оформити замовлення
          </Button>
        </aside>
      </div>
    </main>
  );
}
