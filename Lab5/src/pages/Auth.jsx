import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import styles from './Auth.module.css';

export default function Auth({ mode }) {
  const navigate = useNavigate();
  const isLogin = mode === 'login';
  const [role, setRole] = useState('buyer'); // візуальне перемикання ролі
  const verb = isLogin ? 'Увійти' : 'Зареєструватись';

  const submit = (e) => {
    e.preventDefault();
    navigate(role === 'seller' ? '/profile/seller' : '/profile/buyer');
  };

  return (
    <div className={styles.page}>
      <div className={styles.roles} role="group" aria-label="Роль">
        <Button
          variant="pill"
          aria-pressed={role === 'buyer'}
          onClick={() => setRole('buyer')}
        >
          {verb} як покупець
        </Button>
        <Button
          variant="pill"
          aria-pressed={role === 'seller'}
          onClick={() => setRole('seller')}
        >
          {verb} як продавець
        </Button>
      </div>

      <form className={styles.card} onSubmit={submit}>
        <h1 className={styles.title}>{isLogin ? 'Увійти' : 'Реєстрація'}</h1>
        {!isLogin && <Input placeholder="Ім’я" aria-label="Ім’я" />}
        <Input
          type="email"
          placeholder="Електронна адреса"
          aria-label="Електронна адреса"
        />
        <Input type="password" placeholder="Пароль" aria-label="Пароль" />
        <Button variant="green" full type="submit">
          {verb}
        </Button>
        <p className={styles.alt}>
          {isLogin ? (
            <Link to="/register">Немає акаунта? Зареєструватись</Link>
          ) : (
            <Link to="/login">Вже є акаунт? Увійти</Link>
          )}
        </p>
      </form>
    </div>
  );
}
