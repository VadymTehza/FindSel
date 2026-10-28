import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Button from '../components/Button.jsx';
import { categories } from '../data/categories.js';
import styles from './CreateListing.module.css';

const MAX_PHOTOS = 8;
const MAX_TITLE = 70;

export default function CreateListing() {
  const [title, setTitle] = useState('');
  const [photos, setPhotos] = useState([]);
  const [condition, setCondition] = useState('used');

  const addPhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_PHOTOS - photos.length);
    setPhotos((prev) => [...prev, ...files.map((f) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(f) }))]);
    e.target.value = '';
  };
  const removePhoto = (id) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  return (
    <>
      <Header />
      <main className={styles.page}>
        <nav className={styles.crumbs}><Link to="/">Головна</Link> / Нове оголошення</nav>
        <h1 className={styles.heading}>Створити оголошення</h1>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <section className={styles.card}>
            <h2>Фото</h2>
            <p className={styles.hint}>Перше фото буде головним. До {MAX_PHOTOS} фото.</p>
            <div className={styles.photos}>
              {photos.map((p, i) => (
                <div key={p.id} className={styles.photo}>
                  <img src={p.url} alt={`Фото ${i + 1}`} />
                  {i === 0 && <span className={styles.main}>Головне</span>}
                  <button type="button" className={styles.remove} onClick={() => removePhoto(p.id)} aria-label="Видалити фото">×</button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <label className={styles.add}>
                  <span className={styles.plus}>+</span>
                  Додати фото
                  <input type="file" accept="image/*" multiple hidden onChange={addPhotos} />
                </label>
              )}
            </div>
          </section>

          <section className={styles.card}>
            <h2>Основне</h2>
            <label className={styles.field}>
              <span>Назва</span>
              <input value={title} maxLength={MAX_TITLE} onChange={(e) => setTitle(e.target.value)} placeholder="Наприклад: Ноутбук Asus, 8/256 GB" />
              <small className={styles.counter}>{title.length}/{MAX_TITLE}</small>
            </label>

            <label className={styles.field}>
              <span>Категорія</span>
              <select defaultValue="">
                <option value="" disabled>Оберіть категорію</option>
                {categories.map((c) => <option key={c.id}>{c.name}</option>)}
              </select>
            </label>

            <fieldset className={styles.field}>
              <legend>Стан</legend>
              <div className={styles.segment}>
                <button type="button" aria-pressed={condition === 'new'} onClick={() => setCondition('new')}>Нове</button>
                <button type="button" aria-pressed={condition === 'used'} onClick={() => setCondition('used')}>Вживане</button>
              </div>
            </fieldset>

            <label className={styles.field}>
              <span>Опис</span>
              <textarea rows={6} placeholder="Опишіть стан, комплектацію, причину продажу" />
            </label>
          </section>

          <section className={styles.card}>
            <h2>Ціна і доставка</h2>
            <div className={styles.row}>
              <label className={styles.field}>
                <span>Ціна</span>
                <div className={styles.price}>
                  <input type="number" min="0" placeholder="0" />
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
                <small>Покупець зможе замовити товар з доставкою Новою поштою</small>
              </span>
            </label>
          </section>

          <section className={styles.card}>
            <h2>Контакти</h2>
            <div className={styles.row}>
              <label className={styles.field}><span>Ім’я</span><input placeholder="Ім’я" /></label>
              <label className={styles.field}><span>Телефон</span><input type="tel" placeholder="+380" /></label>
            </div>
          </section>

          <div className={styles.actions}>
            <Link to="/"><Button type="button">Скасувати</Button></Link>
            <Button variant="green" type="submit">Опублікувати</Button>
          </div>
        </form>
      </main>
    </>
  );
}
