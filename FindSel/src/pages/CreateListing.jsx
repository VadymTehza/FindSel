import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { categories } from '../data/categories.js';
import { usePost } from '../hooks/useMutation.js';
import styles from './CreateListing.module.css';

const EMPTY = { title: '', category: '', sub: '', condition: 'Вживане', description: '', price: '', city: '', image: '' };

export default function CreateListing() {
  const navigate = useNavigate();
  const post = usePost();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const subs = categories.find((c) => c.id === form.category)?.sub ?? [];

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.title.trim().length < 3) next.title = 'Назва має містити щонайменше 3 символи';
    if (!form.category) next.category = 'Оберіть категорію';
    if (!(Number(form.price) > 0)) next.price = 'Вкажіть ціну більше нуля';
    if (!form.city.trim()) next.city = 'Вкажіть місто';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    try {
      await post.run('/products', { ...form, price: Number(form.price) });
      navigate('/profile/seller', {
        state: { notice: 'Оголошення створено й відправлено на модерацію. За кілька секунд воно з’явиться в каталозі.' },
      });
    } catch (err) {
      setErrors({ form: err.message });
    }
  };

  const error = (key) => errors[key] && <small className={styles.err}>{errors[key]}</small>;

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Створити оголошення</h1>
      <form className={styles.form} onSubmit={submit} noValidate>
        <section className={styles.card}>
          <h2>Основне</h2>
          <label className={styles.field}>
            <span>Назва</span>
            <input value={form.title} maxLength={70} onChange={set('title')} placeholder="Наприклад: Ноутбук Asus, 8/256 GB" aria-invalid={!!errors.title} />
            {error('title')}
          </label>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Категорія</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, sub: '' })} aria-invalid={!!errors.category}>
                <option value="">Оберіть категорію</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {error('category')}
            </label>
            <label className={styles.field}>
              <span>Підкатегорія</span>
              <select value={form.sub} onChange={set('sub')} disabled={subs.length === 0}>
                <option value="">—</option>
                {subs.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <fieldset className={styles.field}>
            <legend>Стан</legend>
            <div className={styles.segment}>
              {['Нове', 'Вживане'].map((c) => (
                <button key={c} type="button" aria-pressed={form.condition === c} onClick={() => setForm({ ...form, condition: c })}>
                  {c}
                </button>
              ))}
            </div>
          </fieldset>
          <label className={styles.field}>
            <span>Опис</span>
            <textarea rows={5} value={form.description} onChange={set('description')} placeholder="Опишіть стан, комплектацію, причину продажу" />
          </label>
        </section>

        <section className={styles.card}>
          <h2>Ціна і місто</h2>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Ціна</span>
              <div className={styles.price}>
                <input type="number" min="0" value={form.price} onChange={set('price')} placeholder="0" aria-invalid={!!errors.price} />
                <b>грн</b>
              </div>
              {error('price')}
            </label>
            <label className={styles.field}>
              <span>Місто</span>
              <input value={form.city} onChange={set('city')} placeholder="Київ" aria-invalid={!!errors.city} />
              {error('city')}
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <h2>Фото</h2>
          <p className={styles.hint}>Вставте посилання на фото (необов’язково).</p>
          <label className={styles.field}>
            <span>Посилання на фото</span>
            <input type="url" value={form.image} onChange={set('image')} placeholder="https://..." />
          </label>
          {form.image && <img className={styles.preview} src={form.image} alt="Попередній перегляд" />}
        </section>

        {errors.form && (
          <p role="alert" className={styles.err}>
            {errors.form}
          </p>
        )}
        <div className={styles.actions}>
          <Button to="/">Скасувати</Button>
          <Button variant="green" type="submit" disabled={post.loading}>
            {post.loading ? 'Публікація…' : 'Опублікувати'}
          </Button>
        </div>
      </form>
    </main>
  );
}
