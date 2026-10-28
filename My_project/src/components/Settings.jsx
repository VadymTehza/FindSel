import { useState } from 'react';
import Button from './Button.jsx';
import styles from './Settings.module.css';

const TABS = [
  ['personal', 'Особисті дані'],
  ['security', 'Безпека та пароль'],
  ['cards', 'Платіжні картки'],
  ['notifications', 'Сповіщення'],
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?\d[\d\s()-]{8,}$/;

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.switch} ${checked ? styles.on : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function EditableRow({ label, value, validate, onSave, type = 'text' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const start = () => { setDraft(value); setError(''); setSaved(false); setEditing(true); };
  const submit = (e) => {
    e.preventDefault();
    const v = draft.trim();
    const err = validate?.(v);
    if (err) { setError(err); return; }
    onSave(v);
    setEditing(false);
    setSaved(true);
  };

  if (!editing) {
    return (
      <div className={styles.row}>
        <div className={styles.rowText}>
          <span className={styles.label}>{label}</span>
          <strong>{value}</strong>
          {saved && <small role="status" className={styles.ok}>Збережено</small>}
        </div>
        <button className={styles.link} onClick={start}>Змінити</button>
      </div>
    );
  }
  return (
    <form className={styles.editForm} onSubmit={submit} noValidate>
      <label className={styles.field}>
        <span>{label}</span>
        <input type={type} value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus aria-invalid={!!error} />
      </label>
      {error && <small role="alert" className={styles.err}>{error}</small>}
      <div className={styles.btns}>
        <Button variant="green" type="submit">Зберегти</Button>
        <Button type="button" onClick={() => setEditing(false)}>Скасувати</Button>
      </div>
    </form>
  );
}

function Personal({ profile, onChange }) {
  return (
    <section className={styles.card}>
      <h2>Контактна інформація</h2>
      <EditableRow
        label="Ім’я" value={profile.name}
        validate={(v) => (v.length < 2 ? 'Ім’я має містити щонайменше 2 символи' : '')}
        onSave={(v) => onChange('name', v)}
      />
      <EditableRow
        label="Телефон" value={profile.phone} type="tel"
        validate={(v) => (PHONE_RE.test(v) ? '' : 'Введіть коректний номер, наприклад +380 50 123 45 67')}
        onSave={(v) => onChange('phone', v)}
      />
      <EditableRow
        label="Email" value={profile.email} type="email"
        validate={(v) => (EMAIL_RE.test(v) ? '' : 'Введіть коректну email-адресу')}
        onSave={(v) => onChange('email', v)}
      />
    </section>
  );
}

function Security() {
  const [twoFA, setTwoFA] = useState(true);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const set = (k) => (e) => { setPw({ ...pw, [k]: e.target.value }); setDone(false); };

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!pw.current) err.current = 'Введіть поточний пароль';
    if (pw.next.length < 8) err.next = 'Мінімум 8 символів';
    else if (pw.next === pw.current) err.next = 'Новий пароль має відрізнятись від поточного';
    if (pw.confirm !== pw.next) err.confirm = 'Паролі не збігаються';
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setPw({ current: '', next: '', confirm: '' });
      setDone(true);
    }
  };

  const type = show ? 'text' : 'password';
  return (
    <>
      <section className={styles.card}>
        <h2>Двофакторна автентифікація (2FA)</h2>
        <div className={styles.row}>
          <div className={styles.rowText}>
            <strong>{twoFA ? 'Увімкнено' : 'Вимкнено'}</strong>
            <small>Код підтвердження під час входу в акаунт</small>
          </div>
          <Switch checked={twoFA} onChange={setTwoFA} label="Двофакторна автентифікація" />
        </div>
      </section>

      <section className={styles.card}>
        <h2>Змінити пароль</h2>
        <form onSubmit={submit} noValidate>
          <label className={styles.field}>
            <span>Поточний пароль</span>
            <input type={type} value={pw.current} onChange={set('current')} autoComplete="current-password" aria-invalid={!!errors.current} />
            {errors.current && <small role="alert" className={styles.err}>{errors.current}</small>}
          </label>
          <label className={styles.field}>
            <span>Новий пароль</span>
            <input type={type} value={pw.next} onChange={set('next')} autoComplete="new-password" aria-invalid={!!errors.next} />
            {errors.next && <small role="alert" className={styles.err}>{errors.next}</small>}
          </label>
          <label className={styles.field}>
            <span>Повторіть новий пароль</span>
            <input type={type} value={pw.confirm} onChange={set('confirm')} autoComplete="new-password" aria-invalid={!!errors.confirm} />
            {errors.confirm && <small role="alert" className={styles.err}>{errors.confirm}</small>}
          </label>
          <label className={styles.check}>
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Показати паролі
          </label>
          <div className={styles.btns}>
            <Button variant="primary" type="submit">Змінити пароль</Button>
            {done && <small role="status" className={styles.ok}>Пароль змінено</small>}
          </div>
        </form>
      </section>
    </>
  );
}

function Cards() {
  const [cards, setCards] = useState([{ id: 1, brand: 'Visa', last4: '4417', exp: '08/28' }]);
  const [form, setForm] = useState({ number: '', exp: '' });
  const [error, setError] = useState('');

  const add = (e) => {
    e.preventDefault();
    const digits = form.number.replace(/\s/g, '');
    const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(form.exp.trim());
    if (!/^\d{16}$/.test(digits)) return setError('Номер картки має містити 16 цифр');
    if (!m) return setError('Термін дії вкажіть у форматі ММ/РР');
    const brand = digits[0] === '4' ? 'Visa' : digits[0] === '5' ? 'Mastercard' : 'Картка';
    // зберігаємо лише останні 4 цифри
    setCards((prev) => [...prev, { id: Date.now(), brand, last4: digits.slice(-4), exp: form.exp.trim() }]);
    setForm({ number: '', exp: '' });
    setError('');
  };

  return (
    <>
      <section className={styles.card}>
        <h2>Збережені картки</h2>
        {cards.length === 0 && <p>Карток поки немає.</p>}
        {cards.map((c) => (
          <div key={c.id} className={styles.row}>
            <div className={styles.rowText}>
              <strong>{c.brand} •••• {c.last4}</strong>
              <small>Діє до {c.exp}</small>
            </div>
            <button className={styles.link} onClick={() => setCards((p) => p.filter((x) => x.id !== c.id))}>Видалити</button>
          </div>
        ))}
      </section>

      <section className={styles.card}>
        <h2>Додати картку</h2>
        <form onSubmit={add} noValidate>
          <label className={styles.field}>
            <span>Номер картки</span>
            <input inputMode="numeric" placeholder="0000 0000 0000 0000" maxLength={19} value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} autoComplete="cc-number" />
          </label>
          <label className={styles.field}>
            <span>Термін дії</span>
            <input placeholder="ММ/РР" maxLength={5} value={form.exp} onChange={(e) => setForm({ ...form, exp: e.target.value })} autoComplete="cc-exp" />
          </label>
          {error && <small role="alert" className={styles.err}>{error}</small>}
          <div className={styles.btns}><Button variant="primary" type="submit">Додати картку</Button></div>
        </form>
      </section>
    </>
  );
}

function Notifications() {
  const [prefs, setPrefs] = useState({ messages: true, orders: true, promo: false, email: true });
  const items = [
    ['messages', 'Нові повідомлення в чаті'],
    ['orders', 'Зміна статусу замовлення'],
    ['promo', 'Знижки та акції'],
    ['email', 'Розсилка на email'],
  ];
  return (
    <section className={styles.card}>
      <h2>Сповіщення</h2>
      {items.map(([key, label]) => (
        <div key={key} className={styles.row}>
          <span className={styles.rowText}><strong>{label}</strong></span>
          <Switch checked={prefs[key]} label={label} onChange={(v) => setPrefs({ ...prefs, [key]: v })} />
        </div>
      ))}
    </section>
  );
}

export default function Settings({ profile, onChange }) {
  const [tab, setTab] = useState('personal');
  return (
    <>
      <h1>Налаштування аккаунта</h1>
      <div className={styles.tabs} role="tablist" aria-label="Розділи налаштувань">
        {TABS.map(([key, label]) => (
          <button key={key} role="tab" aria-selected={tab === key} className={`${styles.tab} ${tab === key ? styles.active : ''}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className={styles.panel}>
        {tab === 'personal' && <Personal profile={profile} onChange={onChange} />}
        {tab === 'security' && <Security />}
        {tab === 'cards' && <Cards />}
        {tab === 'notifications' && <Notifications />}
      </div>
    </>
  );
}
