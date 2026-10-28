import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import styles from './Auth.module.css';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const [role, setRole] = useState('buyer');
  const verb = isLogin ? 'Увійти' : 'Зареєструватись';

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

      <form className={styles.card} onSubmit={(e) => e.preventDefault()}>
        <h1 className={styles.title}>{isLogin ? 'Увійти' : 'Реєстрація'}</h1>
        {!isLogin && <Input placeholder="Ім’я" aria-label="Ім’я" />}
        <Input type="email" placeholder="Електронна адреса" aria-label="Електронна адреса" />
        <Input type="password" placeholder="Пароль" aria-label="Пароль" />
        <Button variant="green" full type="submit">{verb}</Button>
        <p className={styles.alt}>
          {isLogin ? <Link to="/register">Немає акаунта? Зареєструватись</Link> : <Link to="/login">Вже є акаунт? Увійти</Link>}
        </p>
      </form>
    </div>
  );
}
