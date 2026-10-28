import { useState } from 'react';
import Button from './Button.jsx';
import Modal from './Modal.jsx';
import { promoPlans } from '../data/listings.js';
import { formatPrice } from '../utils/formatPrice.js';
import styles from './ListingDialogs.module.css';

export function PromoDialog({ listing, onClose, onConfirm }) {
  const [planId, setPlanId] = useState(promoPlans[0].id);
  const plan = promoPlans.find((p) => p.id === planId);

  const submit = (e) => {
    e.preventDefault();
    onConfirm(plan);
  };

  return (
    <Modal title="Рекламувати оголошення" onClose={onClose}>
      <p className={styles.lead}>
        {listing.title} · {formatPrice(listing.price)}
      </p>
      <form onSubmit={submit}>
        <fieldset className={styles.plans}>
          <legend className={styles.srOnly}>Тариф</legend>
          {promoPlans.map((p) => (
            <label
              key={p.id}
              className={`${styles.plan} ${p.id === planId ? styles.selected : ''}`}
            >
              <input
                type="radio"
                name="plan"
                checked={p.id === planId}
                onChange={() => setPlanId(p.id)}
              />
              <span className={styles.planText}>
                <strong>{p.label}</strong>
                <small>{p.text}</small>
              </span>
              <b>{formatPrice(p.price)}</b>
            </label>
          ))}
        </fieldset>
        <div className={styles.actions}>
          <Button type="button" onClick={onClose}>
            Скасувати
          </Button>
          <Button variant="green" type="submit">
            Рекламувати за {formatPrice(plan.price)}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function EditListingDialog({ listing, onClose, onSave }) {
  const [form, setForm] = useState({
    title: listing.title,
    price: String(listing.price),
    city: listing.city,
    description: listing.description,
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.title.trim().length < 3) {
      next.title = 'Назва має містити щонайменше 3 символи';
    }
    const price = Number(form.price);
    if (!form.price || Number.isNaN(price) || price <= 0) {
      next.price = 'Вкажіть ціну більше нуля';
    }
    if (!form.city.trim()) next.city = 'Вкажіть місто';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave({
      title: form.title.trim(),
      price,
      city: form.city.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <Modal title="Редагувати оголошення" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <label className={styles.field}>
          <span>Назва</span>
          <input
            value={form.title}
            onChange={set('title')}
            aria-invalid={!!errors.title}
          />
          {errors.title && <small className={styles.err}>{errors.title}</small>}
        </label>
        <div className={styles.row}>
          <label className={styles.field}>
            <span>Ціна, грн</span>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={set('price')}
              aria-invalid={!!errors.price}
            />
            {errors.price && (
              <small className={styles.err}>{errors.price}</small>
            )}
          </label>
          <label className={styles.field}>
            <span>Місто</span>
            <input
              value={form.city}
              onChange={set('city')}
              aria-invalid={!!errors.city}
            />
            {errors.city && <small className={styles.err}>{errors.city}</small>}
          </label>
        </div>
        <label className={styles.field}>
          <span>Опис</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={set('description')}
          />
        </label>
        <div className={styles.actions}>
          <Button type="button" onClick={onClose}>
            Скасувати
          </Button>
          <Button variant="green" type="submit">
            Зберегти зміни
          </Button>
        </div>
      </form>
    </Modal>
  );
}
