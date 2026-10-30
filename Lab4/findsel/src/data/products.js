const photo = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;

export const products = [
  { id: 1, title: 'Ноутбук в хорошому стані', price: '24 500грн', image: photo('photo-1517336714731-489689fd1ca8') },
  { id: 2, title: 'Велосипед', price: '12 000грн', image: photo('photo-1485965120184-e220f721d03e') },
  { id: 3, title: 'Iphone 15 pro 6/256gb grey', price: '25 400грн', image: photo('photo-1592750475338-74b7b21085ab') },
  { id: 4, title: 'Годинник CASIO', price: '3 500грн', image: photo('photo-1524592094714-0f0654e20314') },
  { id: 5, title: 'Навушники Sony з шумопоглинанням', price: '2 800грн', image: photo('photo-1505740420928-5e560c06d30e') },
  { id: 6, title: 'Кросівки Nike, 42 розмір', price: '2 200грн', image: photo('photo-1542291026-7eec264c27ff') },
  { id: 7, title: 'Шкіряна куртка', price: '3 900грн', image: photo('photo-1551028719-00167b16eac5') },
  { id: 8, title: 'Диван сірий розкладний', price: '9 800грн', image: photo('photo-1555041469-a586c61ea9bc') },
];

export const laptop = {
  title: 'Ноутбук Asus',
  price: '18 500грн',
  image: photo('photo-1517336714731-489689fd1ca8'),
};
