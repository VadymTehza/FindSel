import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button.jsx';
import styles from './SupportSection.module.css';

const TOPICS = [
  'Питання щодо замовлення',
  'Оплата і FindGo-доставка',
  'Проблема з оголошенням',
  'Безпека акаунта',
  'Інше',
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY = { name: '', email: '', topic: TOPICS[0], message: '' };

export default function SupportSection() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Вкажіть ім’я';
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Введіть коректний email';
    if (form.message.trim().length < 10) {
      next.message = 'Опишіть питання (щонайменше 10 символів)';
    }
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(true);
      setForm(EMPTY);
    }
  };

  return (
    <section className={styles.support} aria-labelledby="support-title">
      <div className={styles.inner}>
        <div className={styles.info}>
          <h2 id="support-title">Служба підтримки</h2>
          <p className={styles.lead}>
            Маєте питання щодо замовлення, оплати чи оголошення? Ми допоможемо.
          </p>
          <ul className={styles.contacts}>
            <li>
              <span aria-hidden>📞</span>
              <div>
                <strong>0 800 000 000</strong>
                <small>Безкоштовно по Україні</small>
              </div>
            </li>
            <li>
              <span aria-hidden>✉️</span>
              <div>
                <strong>support@findsel.example</strong>
                <small>Відповідаємо протягом 24 годин</small>
              </div>
            </li>
            <li>
              <span aria-hidden>🕘</span>
              <div>
                <strong>Щодня 09:00–21:00</strong>
                <small>Без вихідних</small>
              </div>
            </li>
          </ul>
          <Link to="/chats" className={styles.chat}>
            💬 Написати в чат
          </Link>
        </div>

        {sent ? (
          <div className={styles.success} role="status">
            <h3>Дякуємо! Звернення надіслано</h3>
            <p>Наш оператор зв’яжеться з вами на вказаний email.</p>
            <Button onClick={() => setSent(false)}>Написати ще</Button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={submit} noValidate>
            <div className={styles.row}>
              <label className={styles.field}>
                <span>Ім’я</span>
                <input value={form.name} onChange={set('name')} aria-invalid={!!errors.name} autoComplete="name" />
                {errors.name && <small>{errors.name}</small>}
              </label>
              <label className={styles.field}>
                <span>Email</span>
                <input type="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} autoComplete="email" />
                {errors.email && <small>{errors.email}</small>}
              </label>
            </div>
            <label className={styles.field}>
              <span>Тема</span>
              <select value={form.topic} onChange={set('topic')}>
                {TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Повідомлення</span>
              <textarea rows={4} value={form.message} onChange={set('message')} aria-invalid={!!errors.message} />
              {errors.message && <small>{errors.message}</small>}
            </label>
            <Button variant="green" type="submit">
              Надіслати
            </Button>
          </form>
        )}
      </div>
      <p className={styles.copy}>© 2026 FindSel. Усі права захищено.</p>
    </section>
  );
}
