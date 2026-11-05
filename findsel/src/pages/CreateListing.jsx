import Button from '../components/Button.jsx';
import Header from '../components/Header.jsx';
import { categories } from '../data/categories.js';
import styles from './CreateListing.module.css';

export default function CreateListing() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <h1 className={styles.heading}>Створити оголошення</h1>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <section className={styles.card}>
            <h2>Фото</h2>
            <p className={styles.hint}>Перше фото буде головним. До 8 фото.</p>
            <div className={styles.photos}>
              <label className={styles.add}>
                <span className={styles.plus}>+</span>
                Додати фото
                <input type="file" accept="image/*" multiple hidden />
              </label>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Основне</h2>
            <label className={styles.field}>
              <span>Назва</span>
              <input placeholder="Наприклад: Ноутбук Asus, 8/256 GB" />
            </label>
            <label className={styles.field}>
              <span>Категорія</span>
              <select defaultValue="">
                <option value="" disabled>
                  Оберіть категорію
                </option>
                {categories.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <fieldset className={styles.field}>
              <legend>Стан</legend>
              <div className={styles.segment}>
                <button type="button" aria-pressed="false">
                  Нове
                </button>
                <button type="button" aria-pressed="true">
                  Вживане
                </button>
              </div>
            </fieldset>
            <label className={styles.field}>
              <span>Опис</span>
              <textarea
                rows={6}
                placeholder="Опишіть стан, комплектацію, причину продажу"
              />
            </label>
          </section>

          <section className={styles.card}>
            <h2>Ціна і доставка</h2>
            <div className={styles.row}>
              <label className={styles.field}>
                <span>Ціна</span>
                <div className={styles.price}>
                  <input type="number" placeholder="0" />
                  <b>грн</b>
                </div>
              </label>
              <label className={styles.field}>
                <span>Місто</span>
                <input placeholder="Київ" />
              </label>
            </div>
            <label className={styles.check}>
              <input type="checkbox" defaultChecked />
              <span>
                <strong>FindGo-доставка</strong>
                <small>
                  Покупець зможе замовити товар з доставкою Новою поштою
                </small>
              </span>
            </label>
          </section>

          <section className={styles.card}>
            <h2>Контакти</h2>
            <div className={styles.row}>
              <label className={styles.field}>
                <span>Ім’я</span>
                <input placeholder="Ім’я" />
              </label>
              <label className={styles.field}>
                <span>Телефон</span>
                <input type="tel" placeholder="+380" />
              </label>
            </div>
          </section>

          <div className={styles.actions}>
            <Button to="/">Скасувати</Button>
            <Button variant="green" type="submit">
              Опублікувати
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
