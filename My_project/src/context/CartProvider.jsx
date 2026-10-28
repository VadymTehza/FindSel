import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartContext } from './cartContext.js';
import { catalog } from '../data/products.js';
import { MAX_QTY, PROMO_CODE } from '../utils/cartTotals.js';

const KEY = 'findsel:cart';
const EMPTY = { items: [], promo: false };

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && Array.isArray(raw.items)) {
      return {
        items: raw.items.filter(
          (i) => i.qty > 0 && catalog.some((p) => p.id === i.id)
        ),
        promo: Boolean(raw.promo),
      };
    }
  } catch {
    // пошкоджені дані — починаємо з порожнього кошика
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

  // додає товар; якщо він уже в кошику — нічого не змінює
  const add = useCallback((id) => {
    setCart((c) =>
      c.items.some((i) => i.id === id)
        ? c
        : { ...c, items: [...c.items, { id, qty: 1 }] }
    );
  }, []);

  const setQty = useCallback((id, qty) => {
    const next = Math.min(MAX_QTY, Math.max(1, qty));
    setCart((c) => ({
      ...c,
      items: c.items.map((i) => (i.id === id ? { ...i, qty: next } : i)),
    }));
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

  const removePromo = useCallback(() => {
    setCart((c) => ({ ...c, promo: false }));
  }, []);

  const value = useMemo(() => {
    const lines = cart.items
      .map((i) => {
        const product = catalog.find((p) => p.id === i.id);
        return product ? { ...product, qty: i.qty } : null;
      })
      .filter(Boolean);
    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal: lines.reduce((sum, l) => sum + l.price * l.qty, 0),
      promo: cart.promo,
      isInCart: (id) => cart.items.some((i) => i.id === id),
      add,
      setQty,
      remove,
      clear,
      applyPromo,
      removePromo,
    };
  }, [cart, add, setQty, remove, clear, applyPromo, removePromo]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
