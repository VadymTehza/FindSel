import Link from './Link.jsx';
import Button from './Button.jsx';
import styles from './SupportSection.module.css';

const TOPICS = [
  'Питання щодо замовлення',
  'Оплата і FindGo-доставка',
  'Проблема з оголошенням',
  'Безпека акаунта',
  'Інше',
];

export default function SupportSection() {
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

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Ім’я</span>
              <input autoComplete="name" />
            </label>
            <label className={styles.field}>
              <span>Email</span>
              <input type="email" autoComplete="email" />
            </label>
          </div>
          <label className={styles.field}>
            <span>Тема</span>
            <select>
              {TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>Повідомлення</span>
            <textarea rows={4} />
          </label>
          <Button variant="green" type="submit">
            Надіслати
          </Button>
        </form>
      </div>
      <p className={styles.copy}>© 2026 FindSel. Усі права захищено.</p>
    </section>
  );
}
