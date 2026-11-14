import { useState } from 'react';
import { usePost } from '../hooks/useMutation.js';
import Button from './Button.jsx';
import Modal from './Modal.jsx';
import styles from './ListingDialogs.module.css';

export default function AskSellerDialog({ product, onClose, onSent }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const post = usePost();

  const submit = async (e) => {
    e.preventDefault();
    if (text.trim().length < 5) {
      setError('Напишіть питання (щонайменше 5 символів)');
      return;
    }
    try {
      await post.run('/messages', { productId: product.id, text });
      onSent();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Modal title="Задати питання продавцю" onClose={onClose}>
      <p className={styles.lead}>{product.title}</p>
      <form onSubmit={submit} noValidate>
        <label className={styles.field}>
          <span>Ваше питання</span>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-invalid={!!error}
            placeholder="Наприклад: чи можливий торг?"
          />
          {error && <small className={styles.err}>{error}</small>}
        </label>
        <div className={styles.actions}>
          <Button type="button" onClick={onClose}>
            Скасувати
          </Button>
          <Button variant="green" type="submit" disabled={post.loading}>
            Надіслати
          </Button>
        </div>
      </form>
    </Modal>
  );
}
