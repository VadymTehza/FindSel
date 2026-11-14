import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/useAuth.js';
import styles from './Auth.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ROLE_NAME = { buyer: 'покупця', seller: 'продавця' };

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, logout } = useAuth();
  const [role, setRole] = useState('buyer');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const verb = isLogin ? 'Увійти' : 'Зареєструватись';

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.name.trim().length < 2) return setError('Вкажіть ім’я');
    if (!EMAIL_RE.test(form.email.trim())) return setError('Введіть коректний email');
    if (form.password.length < (isLogin ? 1 : 8)) {
      return setError(isLogin ? 'Введіть пароль' : 'Пароль має містити щонайменше 8 символів');
    }
    setBusy(true);
    setError('');
    try {
      const user = isLogin
        ? await login(form.email.trim(), form.password)
        : await register({ name: form.name.trim(), email: form.email.trim(), password: form.password, role });
      if (isLogin && user.role !== role) {
        await logout();
        setError(`Цей акаунт зареєстровано як ${ROLE_NAME[user.role]}. Оберіть іншу роль.`);
        return;
      }
      navigate(location.state?.from ?? `/profile/${user.role}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.roles} role="group" aria-label="Роль">
        <Button variant="pill" aria-pressed={role === 'buyer'} onClick={() => setRole('buyer')}>
          {verb} як покупець
        </Button>
        <Button variant="pill" aria-pressed={role === 'seller'} onClick={() => setRole('seller')}>
          {verb} як продавець
        </Button>
      </div>

      <form className={styles.card} onSubmit={submit} noValidate>
        <h1 className={styles.title}>{isLogin ? 'Увійти' : 'Реєстрація'}</h1>
        {!isLogin && <Input value={form.name} onChange={set('name')} placeholder="Ім’я" aria-label="Ім’я" autoComplete="name" />}
        <Input type="email" value={form.email} onChange={set('email')} placeholder="Електронна адреса" aria-label="Електронна адреса" autoComplete="email" />
        <Input type="password" value={form.password} onChange={set('password')} placeholder="Пароль" aria-label="Пароль" autoComplete={isLogin ? 'current-password' : 'new-password'} />
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <Button variant="green" full type="submit" disabled={busy}>
          {busy ? 'Зачекайте…' : verb}
        </Button>
        <p className={styles.alt}>
          {isLogin ? <Link to="/register">Немає акаунта? Зареєструватись</Link> : <Link to="/login">Вже є акаунт? Увійти</Link>}
        </p>
        {isLogin && (
          <p className={styles.demo}>
            Демо: seller@findsel.test / Seller123 (продавець)
            <br />
            buyer@findsel.test / Buyer123 (покупець)
          </p>
        )}
      </form>
    </div>
  );
}
