import { useCallback, useEffect, useMemo, useState } from 'react';
import { MAX_QTY, PROMO_CODE } from '../utils/cartTotals.js';
import { CartContext } from './cartContext.js';

const KEY = 'findsel:cart';
const EMPTY = { items: [], promo: false };

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && Array.isArray(raw.items)) {
      return { items: raw.items.filter((i) => i.qty > 0), promo: Boolean(raw.promo) };
    }
  } catch {
    // пошкоджені дані — порожній кошик
  }
  return EMPTY;
}

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {
      // сховище недоступне — ігноруємо
    }
  }, [cart]);

  // зберігаємо знімок товару (назва, ціна, фото), щоб кошик не залежав від сервера
  const add = useCallback((p) => {
    setCart((c) =>
      c.items.some((i) => i.id === p.id)
        ? c
        : { ...c, items: [...c.items, { id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 }] }
    );
  }, []);

  const setQty = useCallback((id, qty) => {
    const next = Math.min(MAX_QTY, Math.max(1, qty));
    setCart((c) => ({ ...c, items: c.items.map((i) => (i.id === id ? { ...i, qty: next } : i)) }));
  }, []);

  const remove = useCallback((id) => {
    setCart((c) => ({ ...c, items: c.items.filter((i) => i.id !== id) }));
  }, []);

  const clear = useCallback(() => setCart(EMPTY), []);

  const applyPromo = useCallback((code) => {
    const ok = code.trim().toUpperCase() === PROMO_CODE;
    if (ok) setCart((c) => ({ ...c, promo: true }));
    return ok;
  }, []);

  const removePromo = useCallback(() => setCart((c) => ({ ...c, promo: false })), []);

  const value = useMemo(
    () => ({
      lines: cart.items,
      count: cart.items.reduce((s, l) => s + l.qty, 0),
      subtotal: cart.items.reduce((s, l) => s + l.price * l.qty, 0),
      promo: cart.promo,
      isInCart: (id) => cart.items.some((i) => i.id === id),
      add,
      setQty,
      remove,
      clear,
      applyPromo,
      removePromo,
    }),
    [cart, add, setQty, remove, clear, applyPromo, removePromo]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
