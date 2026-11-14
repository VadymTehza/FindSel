import { useState } from 'react';
import Button from '../components/Button.jsx';
import { useAuth } from '../context/useAuth.js';
import { useCart } from '../context/useCart.js';
import { usePost } from '../hooks/useMutation.js';
import { getTotals } from '../utils/cartTotals.js';
import { formatPrice } from '../utils/formatPrice.js';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { user } = useAuth();
  const { lines, subtotal, promo, clear } = useCart();
  const post = usePost();
  const [form, setForm] = useState({ type: 'branch', city: '', branch: '', comment: '', payment: 'cash' });
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const totals = getTotals(subtotal, promo);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const placeOrder = async () => {
    if (!form.city.trim() || !form.branch.trim()) return setError('Вкажіть місто та відділення доставки');
    if (!agree) return setError('Потрібно погодитись з умовами');
    setError('');
    try {
      const created = await post.run('/orders', {
        items: lines.map((l) => ({ productId: l.id, qty: l.qty })),
        promoCode: promo ? 'FIND50' : '',
        payment: form.payment,
        comment: form.comment,
        delivery: { type: form.type, city: form.city, branch: form.branch },
      });
      clear();
      setOrder(created);
    } catch (err) {
      setError(err.message);
    }
  };

  if (order) {
    return (
      <main className={styles.page}>
        <div className={styles.done}>
          <h1>Замовлення №{order.id} оформлено</h1>
          <p>Сума до оплати: {formatPrice(order.total)}. ТТН: {order.ttn}</p>
          <div className={styles.doneActions}>
            <Button variant="green" to="/profile/buyer">
              Мої покупки
            </Button>
            <Button to="/">До каталогу</Button>
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
            <Button variant="green" to="/">
              До каталогу
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>
        Оформлення замовлення{' '}
        <Button to="/cart" variant="outline">
          ← Назад до кошика
        </Button>
      </h1>
      <div className={styles.layout}>
        <div>
          <section className={styles.section}>
            <h2>1. Контактна інформація</h2>
            <div className={styles.white}>
              <p>Ім’я: {user.name}</p>
              <p>Номер телефону: {user.phone || 'не вказано (додайте в налаштуваннях)'}</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>2. Спосіб доставки</h2>
            <div className={styles.panel}>
              <p className={styles.smart}>🚚 FindGo-доставка</p>
              <div className={styles.np}>
                <h3>Нова пошта</h3>
                {[
                  ['branch', 'У відділення'],
                  ['locker', 'У поштомат'],
                  ['courier', 'Кур’єром'],
                ].map(([value, label]) => (
                  <label key={value}>
                    <input type="radio" name="d" value={value} checked={form.type === value} onChange={set('type')} /> {label}
                  </label>
                ))}
                <label className={styles.f}>
                  Місто
                  <input value={form.city} onChange={set('city')} placeholder="Київ" />
                </label>
                <label className={styles.f}>
                  Відділення
                  <input value={form.branch} onChange={set('branch')} placeholder="№ 12" />
                </label>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>3. Коментар</h2>
            <textarea className={styles.comment} rows={4} value={form.comment} onChange={set('comment')} placeholder="Коментар до замовлення" />
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
            <input type="radio" name="p" value="card" checked={form.payment === 'card'} onChange={set('payment')} /> Платіжна карта
          </label>
          <label className={styles.pay}>
            <input type="radio" name="p" value="cash" checked={form.payment === 'cash'} onChange={set('payment')} /> Готівка при отриманні
          </label>
          <label className={styles.pay}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> Погоджуюсь з умовами
          </label>
          <dl>
            <div><dt>Товар(и):</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div><dt>Доставка:</dt><dd>{formatPrice(totals.delivery)}</dd></div>
            <div><dt>Комісія FindGo:</dt><dd>{formatPrice(totals.commission)}</dd></div>
            <div><dt>Промокод:</dt><dd>{totals.discount ? `-${formatPrice(totals.discount)}` : '0грн'}</dd></div>
          </dl>
          <p className={styles.total}>
            <span>Всього до оплати:</span>
            <strong>{formatPrice(totals.total)}</strong>
          </p>
          {error && (
            <p role="alert" className={styles.err}>
              {error}
            </p>
          )}
          <Button variant="green" full onClick={placeOrder} disabled={post.loading}>
            {post.loading ? 'Оформлення…' : 'Оформити замовлення'}
          </Button>
        </aside>
      </div>
    </main>
  );
}
