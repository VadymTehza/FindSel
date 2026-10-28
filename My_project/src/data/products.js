const photo = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;

const seller = (name, rating, phone) => ({ name, rating, phone });

export const products = [
  {
    id: 1, title: 'Ноутбук в хорошому стані', price: 24500,
    category: 'electronics', sub: 'Ноутбуки', condition: 'Вживане', city: 'Київ',
    posted: '2 години тому', rating: 4.8, reviews: 36,
    seller: seller('Андрій', 4.8, '+380 50 123 45 67'),
    description: 'Ноутбук у хорошому стані, працює без нарікань. Повна комплектація, є зарядний пристрій. Можливий огляд і перевірка перед покупкою.',
    image: photo('photo-1517336714731-489689fd1ca8'),
  },
  {
    id: 2, title: 'Велосипед', price: 12000,
    category: 'transport', sub: 'Велосипеди', condition: 'Вживане', city: 'Львів',
    posted: 'вчора', rating: 4.7, reviews: 12,
    seller: seller('Олена', 4.7, '+380 67 222 33 44'),
    description: 'Міський велосипед, їздили один сезон. Рама без тріщин, гальма та перемикачі працюють чітко.',
    image: photo('photo-1485965120184-e220f721d03e'),
  },
  {
    id: 3, title: 'Iphone 15 pro 6/256gb grey', price: 25400,
    category: 'electronics', sub: 'Смартфони', condition: 'Вживане', city: 'Київ',
    posted: '3 дні тому', rating: 4.9, reviews: 54,
    seller: seller('TechStore Київ', 4.9, '+380 44 500 60 70'),
    description: 'Телефон у ідеальному стані, з гарантією 12 місяців. У комплекті кабель і чохол.',
    image: photo('photo-1592750475338-74b7b21085ab'),
  },
  {
    id: 4, title: 'Годинник CASIO', price: 3500,
    category: 'accessories', sub: 'Годинники', condition: 'Нове', city: 'Одеса',
    posted: '5 днів тому', rating: 4.6, reviews: 21,
    seller: seller('Лайк шоп', 4.6, '+380 63 111 22 33'),
    description: 'Кварцовий годинник CASIO, водостійкий. Нові, в оригінальній упаковці.',
    image: photo('photo-1524592094714-0f0654e20314'),
  },
  {
    id: 5, title: 'Навушники Sony з шумопоглинанням', price: 2800,
    category: 'electronics', sub: 'Аксесуари', condition: 'Вживане', city: 'Харків',
    posted: '1 день тому', rating: 4.7, reviews: 18,
    seller: seller('Максим', 4.7, '+380 93 444 55 66'),
    description: 'Бездротові навушники з активним шумопоглинанням. Акумулятор тримає понад 20 годин.',
    image: photo('photo-1505740420928-5e560c06d30e'),
  },
  {
    id: 6, title: 'Кросівки Nike, 42 розмір', price: 2200,
    category: 'clothes', sub: 'Взуття', condition: 'Нове', city: 'Дніпро',
    posted: '4 години тому', rating: 4.5, reviews: 9,
    seller: seller('Софія', 4.5, '+380 98 777 88 99'),
    description: 'Нові кросівки, не підійшов розмір. Є коробка та чек.',
    image: photo('photo-1542291026-7eec264c27ff'),
  },
  {
    id: 7, title: 'Шкіряна куртка', price: 3900,
    category: 'clothes', sub: 'Куртки', condition: 'Вживане', city: 'Київ',
    posted: '2 дні тому', rating: 4.6, reviews: 14,
    seller: seller('Дмитро', 4.6, '+380 66 321 54 76'),
    description: 'Куртка з натуральної шкіри, розмір M. Носили один сезон, без дефектів.',
    image: photo('photo-1551028719-00167b16eac5'),
  },
  {
    id: 8, title: 'Диван сірий розкладний', price: 9800,
    category: 'home', sub: 'Меблі', condition: 'Вживане', city: 'Вінниця',
    posted: '6 днів тому', rating: 4.8, reviews: 27,
    seller: seller('Наталія', 4.8, '+380 97 654 32 10'),
    description: 'Зручний розкладний диван, тканина без плям. Самовивіз.',
    image: photo('photo-1555041469-a586c61ea9bc'),
  },
  {
    id: 9, title: 'Спортивне купе, 2018', price: 1650000,
    category: 'transport', sub: 'Легкові авто', condition: 'Вживане', city: 'Київ',
    posted: '1 тиждень тому', rating: 4.9, reviews: 7,
    seller: seller('АвтоЦентр', 4.9, '+380 44 300 40 50'),
    description: 'Автомобіль у відмінному стані, один власник, повна сервісна історія.',
    image: photo('photo-1503376780353-7e6692767b70'),
  },
  {
    id: 11, title: 'Будинок 120 м² з ділянкою', price: 4500000,
    category: 'realty', sub: 'Будинки', condition: 'Вживане', city: 'Ужгород',
    posted: '2 тижні тому', rating: 4.8, reviews: 5,
    seller: seller('Нерухомість Плюс', 4.8, '+380 31 200 30 40'),
    description: 'Сучасний будинок із земельною ділянкою 6 соток. Автономне опалення, гараж.',
    image: photo('photo-1560448204-e02f11c3d0e2'),
  },
];

export const laptop = {
  id: 10, title: 'Ноутбук Asus', price: 18500,
  category: 'electronics', sub: 'Ноутбуки', condition: 'Вживане', city: 'Київ',
  posted: '2 години тому', rating: 4.9, reviews: 180,
  seller: seller('Ім’я', 4.9, '+380 50 123 45 67'),
  description: 'Ноутбук Asus у хорошому стані, повний комплект. Швидко вмикається, батареї вистачає на 5–6 годин.',
  status: 'Активно',
  image: photo('photo-1517336714731-489689fd1ca8'),
};

export const catalog = [...products, laptop];
