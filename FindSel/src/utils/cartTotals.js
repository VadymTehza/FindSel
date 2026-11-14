export const MAX_QTY = 10;
export const PROMO_CODE = 'FIND50';
const DELIVERY = 95;
const COMMISSION = 50;
const PROMO_DISCOUNT = 50;

export function getTotals(subtotal, promo) {
  if (subtotal === 0) {
    return { delivery: 0, commission: 0, discount: 0, total: 0 };
  }
  const discount = promo ? PROMO_DISCOUNT : 0;
  return {
    delivery: DELIVERY,
    commission: COMMISSION,
    discount,
    total: subtotal + DELIVERY + COMMISSION - discount,
  };
}
