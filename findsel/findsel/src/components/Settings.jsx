import Button from './Button.jsx';
import Tabs from './Tabs.jsx';
import styles from './Settings.module.css';

const TABS = [
  { key: 'personal', label: 'Особисті дані' },
  { key: 'security', label: 'Безпека та пароль' },
  { key: 'cards', label: 'Платіжні картки' },
  { key: 'notifications', label: 'Сповіщення' },
];

function Row({ label, value, action = 'Змінити' }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowText}>
        <span className={styles.label}>{label}</span>
        <strong>{value}</strong>
      </div>
      <button type="button" className={styles.link}>
        {action}
      </button>
    </div>
  );
}

export default function Settings() {
  return (
    <>
      <h1>Налаштування аккаунта</h1>
      <Tabs tabs={TABS} active="personal" label="Розділи налаштувань" />
      <div className={styles.panel}>
        <section className={styles.card}>
          <h2>Контактна інформація</h2>
          <Row label="Ім’я" value="**********" />
          <Row label="Телефон" value="**********" />
          <Row label="Email" value="*********" />
        </section>
        <section className={styles.card}>
          <h2>Безпека</h2>
          <Row label="Двофакторна автентифікація (2FA)" value="Увімкнено" action="Змінити" />
          <Row label="Пароль" value="********" />
        </section>
        <div className={styles.save}>
          <Button variant="primary">Зберегти зміни</Button>
        </div>
      </div>
    </>
  );
}
