import Button from '../components/Button.jsx';
import { laptop } from '../data/products.js';
import styles from './Checkout.module.css';

export default function Checkout() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Оформлення замовлення</h1>
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
            <div className={styles.product}>
              <img src={laptop.image} alt={laptop.title} />
              <div>
                <strong>{laptop.title}</strong>
                <p>★ 4.9(100)</p>
              </div>
              <strong>{laptop.price}</strong>
            </div>
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
              <dd>18 500грн</dd>
            </div>
            <div>
              <dt>Доставка:</dt>
              <dd>95грн</dd>
            </div>
            <div>
              <dt>Промокод:</dt>
              <dd>0грн</dd>
            </div>
          </dl>
          <p className={styles.total}>
            <span>Всього до оплати:</span>
            <strong>18 595грн</strong>
          </p>
          <Button variant="green" full to="/profile/buyer">
            Оформити замовлення
          </Button>
        </aside>
      </div>
    </main>
  );
}
