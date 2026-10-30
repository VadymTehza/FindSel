import Button from '../components/Button.jsx';
import Header from '../components/Header.jsx';
import { laptop } from '../data/products.js';
import styles from './Cart.module.css';

export default function Cart() {
  return (
    <>
      <Header />
      <div className={styles.bg}>
        <main className={styles.page}>
          <h1 className={styles.title}>🛒 Кошик(1)</h1>
          <div className={styles.layout}>
            <section className={styles.items} aria-label="Товари в кошику">
              <article className={styles.item}>
                <img src={laptop.image} alt={laptop.title} />
                <div className={styles.body}>
                  <h2>{laptop.title}</h2>
                  <p>⭐ 4.9(180)</p>
                  <div className={styles.qty}>
                    <button type="button" aria-label="Зменшити кількість">
                      -
                    </button>
                    <span>1</span>
                    <button type="button" aria-label="Збільшити кількість">
                      +
                    </button>
                  </div>
                </div>
                <div className={styles.side}>
                  <strong>{laptop.price}</strong>
                  <button
                    type="button"
                    className={styles.trash}
                    aria-label="Видалити товар"
                  >
                    🗑
                  </button>
                </div>
              </article>
            </section>

            <aside className={styles.summary}>
              <h2>Підсумок замовлення</h2>
              <dl>
                <div>
                  <dt>Товари(1)</dt>
                  <dd>18 500грн</dd>
                </div>
                <div>
                  <dt>Доставка(Нова пошта)</dt>
                  <dd>95грн</dd>
                </div>
                <div>
                  <dt>Комісія FindGo-доставка</dt>
                  <dd>50грн</dd>
                </div>
                <div>
                  <dt>Промокод</dt>
                  <dd>-50грн</dd>
                </div>
              </dl>
              <p className={styles.total}>
                <span>Ціна:</span>
                <strong>18 595грн</strong>
              </p>
              <Button variant="green" full to="/checkout">
                Перейти до оформлення
              </Button>
              <label className={styles.agree}>
                <input type="checkbox" defaultChecked /> Погоджуюся з умовами та
                FindGo-доставкою
              </label>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
