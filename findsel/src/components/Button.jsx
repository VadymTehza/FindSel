import Link from './Link.jsx';
import styles from './Button.module.css';

export default function Button({
  variant = 'outline',
  full,
  to,
  children,
  ...props
}) {
  const cls = [styles.btn, styles[variant], full && styles.full]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link className={cls} to={to} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
