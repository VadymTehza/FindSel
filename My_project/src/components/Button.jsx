import styles from './Button.module.css';

export default function Button({ variant = 'outline', full, children, ...props }) {
  const cls = [styles.btn, styles[variant], full && styles.full].filter(Boolean).join(' ');
  return <button className={cls} {...props}>{children}</button>;
}
