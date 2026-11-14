/* eslint-env node */
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sampleReviews, seedProducts } from './seed.js';

const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'db.json');

const PROMO_CODE = 'FIND50';
const DELIVERY = 95;
const COMMISSION = 50;
const DISCOUNT = 50;
const CATEGORIES = ['electronics', 'transport', 'clothes', 'realty', 'home', 'accessories'];
const AUTO_REPLIES = [
  'Доброго дня! Товар ще в наявності.',
  'Вітаю! Так, можемо домовитись про зустріч або відправити FindGo-доставкою.',
  'Дякую за інтерес! Торг можливий, пишіть свою пропозицію.',
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const fail = (status, message) => {
  throw new HttpError(status, message);
};

// ---------- паролі ----------
const hash = (pw) => {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${crypto.scryptSync(pw, salt, 32).toString('hex')}`;
};
const verify = (pw, stored) => {
  const [salt, key] = stored.split(':');
  const a = Buffer.from(key, 'hex');
  const b = crypto.scryptSync(pw, salt, 32);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// ---------- база даних (JSON-файл) ----------
const ago = (min) => new Date(Date.now() - min * 60000).toISOString();

function createDb() {
  const reviews = [];
  seedProducts.forEach((prod) =>
    sampleReviews.forEach((r) => reviews.push({ id: reviews.length + 1, productId: prod.id, userId: 0, ...r }))
  );
  return {
    seq: { users: 2, products: 14, reviews: reviews.length, orders: 0, messages: 0, support: 0, chats: 1, chatMessages: 3 },
    users: [
      { id: 1, name: 'Андрій', email: 'seller@findsel.test', phone: '+380 50 123 45 67', role: 'seller', twoFA: true, passwordHash: hash('Seller123') },
      { id: 2, name: 'Олена', email: 'buyer@findsel.test', phone: '+380 67 222 33 44', role: 'buyer', twoFA: false, passwordHash: hash('Buyer123') },
    ],
    sessions: {},
    products: seedProducts,
    reviews,
    favorites: [],
    orders: [],
    messages: [],
    support: [],
    chats: [{ id: 1, productId: 10, buyerId: 2, sellerId: 1, createdAt: ago(30), reads: {} }],
    chatMessages: [
      { id: 1, chatId: 1, fromUserId: 2, text: 'Привіт! Чи можна оглянути ноутбук сьогодні?', createdAt: ago(30) },
      { id: 2, chatId: 1, fromUserId: 1, text: 'Доброго дня! Так, можемо зустрітись після 17:00 або відправити FindGo-доставкою.', createdAt: ago(20) },
      { id: 3, chatId: 1, fromUserId: 2, text: 'Домовились, дякую!', createdAt: ago(10) },
    ],
  };
}
const db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) : createDb();
db.chats = db.chats ?? [];
db.chatMessages = db.chatMessages ?? [];
db.seq.chats = db.seq.chats ?? 0;
db.seq.chatMessages = db.seq.chatMessages ?? 0;
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
const nextId = (key) => (db.seq[key] += 1);
save();

// ---------- допоміжні ----------
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, twoFA: u.twoFA });

function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  });
  res.end(data === null ? '' : JSON.stringify(data));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) reject(new HttpError(413, 'Запит завеликий'));
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new HttpError(400, 'Некоректний JSON'));
      }
    });
  });
}

const dateUa = () => new Date().toLocaleDateString('uk-UA');

// ---------- обробник ----------
async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean); // ['api','products','3',...]
  const method = req.method;

  if (method === 'OPTIONS') return send(res, 204, null);
  if (parts[0] !== 'api') fail(404, 'Не знайдено');
  const [, a, b, c] = parts;

  const token = (req.headers.authorization ?? '').replace(/^Bearer /, '');
  const me = db.users.find((u) => u.id === db.sessions[token]) ?? null;
  const requireUser = () => me ?? fail(401, 'Потрібно увійти в акаунт');
  const body = ['POST', 'PATCH', 'PUT'].includes(method) ? await readJson(req) : {};

  const startSession = (user, status = 200) => {
    const t = crypto.randomBytes(24).toString('hex');
    db.sessions[t] = user.id;
    save();
    return send(res, status, { token: t, user: publicUser(user) });
  };

  // --- авторизація ---
  if (a === 'auth') {
    if (b === 'register' && method === 'POST') {
      const { name = '', email = '', password = '', role = 'buyer' } = body;
      if (name.trim().length < 2) fail(400, 'Ім’я має містити щонайменше 2 символи');
      if (!EMAIL_RE.test(email.trim())) fail(400, 'Введіть коректний email');
      if (password.length < 8) fail(400, 'Пароль має містити щонайменше 8 символів');
      if (!['buyer', 'seller'].includes(role)) fail(400, 'Невідома роль');
      const mail = email.trim().toLowerCase();
      if (db.users.some((u) => u.email === mail)) fail(409, 'Користувач із таким email уже існує');
      const user = { id: nextId('users'), name: name.trim(), email: mail, phone: '', role, twoFA: false, passwordHash: hash(password) };
      db.users.push(user);
      return startSession(user, 201);
    }
    if (b === 'login' && method === 'POST') {
      const user = db.users.find((u) => u.email === String(body.email ?? '').trim().toLowerCase());
      if (!user || !verify(String(body.password ?? ''), user.passwordHash)) fail(401, 'Невірний email або пароль');
      return startSession(user);
    }
    if (b === 'me' && method === 'GET') return send(res, 200, publicUser(requireUser()));
    if (b === 'logout' && method === 'POST') {
      delete db.sessions[token];
      save();
      return send(res, 200, { ok: true });
    }
  }

  // --- профіль ---
  if (a === 'users' && b === 'me') {
    const user = requireUser();
    if (!c && method === 'PATCH') {
      if (body.name !== undefined) {
        if (String(body.name).trim().length < 2) fail(400, 'Ім’я має містити щонайменше 2 символи');
        user.name = String(body.name).trim();
      }
      if (body.phone !== undefined) {
        if (!/^\+?\d[\d\s()-]{8,}$/.test(String(body.phone).trim())) fail(400, 'Введіть коректний номер телефону');
        user.phone = String(body.phone).trim();
      }
      if (body.email !== undefined) {
        const mail = String(body.email).trim().toLowerCase();
        if (!EMAIL_RE.test(mail)) fail(400, 'Введіть коректний email');
        if (db.users.some((u) => u.email === mail && u.id !== user.id)) fail(409, 'Цей email уже використовується');
        user.email = mail;
      }
      if (body.twoFA !== undefined) user.twoFA = Boolean(body.twoFA);
      save();
      return send(res, 200, publicUser(user));
    }
    if (c === 'password' && method === 'POST') {
      if (!verify(String(body.current ?? ''), user.passwordHash)) fail(400, 'Поточний пароль введено невірно');
      if (String(body.next ?? '').length < 8) fail(400, 'Новий пароль має містити щонайменше 8 символів');
      user.passwordHash = hash(body.next);
      save();
      return send(res, 200, { ok: true });
    }
  }

  // --- товари ---
  if (a === 'products') {
    if (!b && method === 'GET') {
      const q = (url.searchParams.get('q') ?? '').toLowerCase();
      const category = url.searchParams.get('category');
      const sub = url.searchParams.get('sub');
      const ids = url.searchParams.get('ids')?.split(',').map(Number);
      let list;
      if (url.searchParams.get('owner') === 'me') {
        list = db.products.filter((x) => x.ownerId === requireUser().id);
      } else {
        list = db.products.filter((x) => x.status === 'active');
      }
      if (ids) list = list.filter((x) => ids.includes(x.id));
      if (category) list = list.filter((x) => x.category === category);
      if (sub) list = list.filter((x) => x.sub === sub);
      if (q) list = list.filter((x) => x.title.toLowerCase().includes(q));
      list.sort((x, y) => Number(Boolean(y.promo)) - Number(Boolean(x.promo)) || y.id - x.id);
      return send(res, 200, list);
    }
    if (!b && method === 'POST') {
      const user = requireUser();
      if (user.role !== 'seller') fail(403, 'Створювати оголошення можуть лише продавці');
      const price = Number(body.price);
      if (String(body.title ?? '').trim().length < 3) fail(400, 'Назва має містити щонайменше 3 символи');
      if (!(price > 0)) fail(400, 'Вкажіть ціну більше нуля');
      if (!CATEGORIES.includes(body.category)) fail(400, 'Оберіть категорію');
      if (!String(body.city ?? '').trim()) fail(400, 'Вкажіть місто');
      const product = {
        id: nextId('products'),
        ownerId: user.id,
        status: 'moderation',
        title: body.title.trim(),
        price,
        category: body.category,
        sub: body.sub ?? '',
        condition: body.condition === 'Нове' ? 'Нове' : 'Вживане',
        city: body.city.trim(),
        posted: 'щойно',
        rating: 5,
        reviews: 0,
        views: 0,
        favorites: 0,
        promo: null,
        seller: { name: user.name, rating: 5, phone: user.phone },
        description: String(body.description ?? '').trim(),
        image: String(body.image ?? '').trim() || `https://picsum.photos/seed/findsel${Date.now()}/700/500`,
      };
      db.products.push(product);
      save();
      // імітація модерації: за 15 секунд оголошення стає активним
      setTimeout(() => {
        const item = db.products.find((x) => x.id === product.id);
        if (item && item.status === 'moderation') {
          item.status = 'active';
          save();
        }
      }, 15000);
      return send(res, 201, product);
    }
    const product = db.products.find((x) => x.id === Number(b));
    if (!product) fail(404, 'Товар не знайдено');

    if (!c && method === 'GET') return send(res, 200, product);
    if (!c && method === 'PATCH') {
      const user = requireUser();
      if (product.ownerId !== user.id) fail(403, 'Це не ваше оголошення');
      if (body.title !== undefined) {
        if (String(body.title).trim().length < 3) fail(400, 'Назва має містити щонайменше 3 символи');
        product.title = String(body.title).trim();
      }
      if (body.price !== undefined) {
        if (!(Number(body.price) > 0)) fail(400, 'Вкажіть ціну більше нуля');
        product.price = Number(body.price);
      }
      if (body.city !== undefined) {
        if (!String(body.city).trim()) fail(400, 'Вкажіть місто');
        product.city = String(body.city).trim();
      }
      if (body.description !== undefined) product.description = String(body.description).trim();
      if (body.status !== undefined) {
        if (!['active', 'inactive'].includes(body.status)) fail(400, 'Некоректний статус');
        if (product.status === 'moderation') fail(400, 'Оголошення ще на модерації');
        product.status = body.status;
      }
      if (body.promo) {
        const until = new Date(Date.now() + Number(body.promo.days || 1) * 86400000);
        product.promo = { label: String(body.promo.label), until: until.toISOString() };
      }
      save();
      return send(res, 200, product);
    }
    if (c === 'reviews' && method === 'GET') {
      return send(res, 200, db.reviews.filter((r) => r.productId === product.id).sort((x, y) => y.id - x.id));
    }
    if (c === 'reviews' && method === 'POST') {
      const user = requireUser();
      const stars = Number(body.stars);
      if (!Number.isInteger(stars) || stars < 1 || stars > 5) fail(400, 'Оберіть оцінку від 1 до 5');
      if (String(body.text ?? '').trim().length < 5) fail(400, 'Напишіть кілька слів про товар');
      const review = { id: nextId('reviews'), productId: product.id, userId: user.id, author: user.name, stars, text: body.text.trim(), date: dateUa() };
      db.reviews.push(review);
      product.rating = Math.round(((product.rating * product.reviews + stars) / (product.reviews + 1)) * 10) / 10;
      product.reviews += 1;
      save();
      return send(res, 201, review);
    }
  }

  // --- обране ---
  if (a === 'favorites') {
    const user = requireUser();
    if (!b && method === 'GET') {
      return send(res, 200, db.favorites.filter((f) => f.userId === user.id).map((f) => f.productId));
    }
    const productId = Number(b);
    if (!db.products.some((x) => x.id === productId)) fail(404, 'Товар не знайдено');
    const exists = db.favorites.some((f) => f.userId === user.id && f.productId === productId);
    if (method === 'POST') {
      if (!exists) db.favorites.push({ userId: user.id, productId });
      save();
      return send(res, 201, { productId });
    }
    if (method === 'DELETE') {
      db.favorites = db.favorites.filter((f) => !(f.userId === user.id && f.productId === productId));
      save();
      return send(res, 200, { productId });
    }
  }

  // --- замовлення ---
  if (a === 'orders') {
    const user = requireUser();
    if (method === 'GET') {
      return send(res, 200, db.orders.filter((o) => o.userId === user.id).sort((x, y) => y.id - x.id));
    }
    if (method === 'POST') {
      const items = Array.isArray(body.items) ? body.items : [];
      if (items.length === 0) fail(400, 'Кошик порожній');
      if (!String(body.delivery?.city ?? '').trim() || !String(body.delivery?.branch ?? '').trim()) {
        fail(400, 'Вкажіть місто та відділення доставки');
      }
      if (!['card', 'cash'].includes(body.payment)) fail(400, 'Оберіть спосіб оплати');
      const lines = items.map((it) => {
        const prod = db.products.find((x) => x.id === Number(it.productId) && x.status === 'active');
        const qty = Number(it.qty);
        if (!prod) fail(400, 'Один із товарів більше недоступний');
        if (!Number.isInteger(qty) || qty < 1 || qty > 10) fail(400, 'Некоректна кількість');
        return { productId: prod.id, title: prod.title, price: prod.price, image: prod.image, qty };
      });
      const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
      const discount = String(body.promoCode ?? '').trim().toUpperCase() === PROMO_CODE ? DISCOUNT : 0;
      const order = {
        id: nextId('orders'),
        userId: user.id,
        items: lines,
        subtotal,
        delivery: DELIVERY,
        commission: COMMISSION,
        discount,
        total: subtotal + DELIVERY + COMMISSION - discount,
        status: 'В дорозі',
        ttn: String(Math.floor(2e10 + Math.random() * 1e10)),
        payment: body.payment,
        address: { city: body.delivery.city.trim(), branch: body.delivery.branch.trim() },
        comment: String(body.comment ?? '').trim(),
        createdAt: new Date().toISOString(),
      };
      db.orders.push(order);
      save();
      return send(res, 201, order);
    }
  }

  // --- питання продавцю ---
  if (a === 'messages' && method === 'POST') {
    const user = requireUser();
    if (!db.products.some((x) => x.id === Number(body.productId))) fail(404, 'Товар не знайдено');
    if (String(body.text ?? '').trim().length < 5) fail(400, 'Напишіть питання (щонайменше 5 символів)');
    const msg = { id: nextId('messages'), userId: user.id, productId: Number(body.productId), text: body.text.trim(), createdAt: new Date().toISOString() };
    db.messages.push(msg);
    save();
    return send(res, 201, msg);
  }

  // --- чати ---
  if (a === 'chats') {
    const user = requireUser();
    const mine = (chat) => chat.buyerId === user.id || chat.sellerId === user.id;
    const chatMsgs = (chat) => db.chatMessages.filter((m) => m.chatId === chat.id);
    const summary = (chat) => {
      const product = db.products.find((x) => x.id === chat.productId);
      const msgs = chatMsgs(chat);
      const last = msgs[msgs.length - 1] ?? null;
      const iAmBuyer = chat.buyerId === user.id;
      const seller = db.users.find((u) => u.id === chat.sellerId);
      const buyer = db.users.find((u) => u.id === chat.buyerId);
      const readUpTo = chat.reads[user.id] ?? 0;
      return {
        id: chat.id,
        productId: chat.productId,
        product: product ? { title: product.title, price: product.price, image: product.image } : null,
        partner: iAmBuyer ? (seller?.name ?? product?.seller.name ?? 'Продавець') : (buyer?.name ?? 'Покупець'),
        partnerRole: iAmBuyer ? 'Продавець' : 'Покупець',
        last: last ? { text: last.text, fromMe: last.fromUserId === user.id, createdAt: last.createdAt } : null,
        updatedAt: last?.createdAt ?? chat.createdAt,
        unread: msgs.filter((m) => m.fromUserId !== user.id && m.id > readUpTo).length,
      };
    };

    if (!b && method === 'GET') {
      const list = db.chats.filter(mine).map(summary);
      return send(res, 200, list.sort((x, y) => String(y.updatedAt).localeCompare(String(x.updatedAt))));
    }
    if (!b && method === 'POST') {
      const product = db.products.find((x) => x.id === Number(body.productId));
      if (!product) fail(404, 'Товар не знайдено');
      if (product.ownerId === user.id) fail(400, 'Це ваше власне оголошення');
      let chat = db.chats.find((x) => x.productId === product.id && x.buyerId === user.id);
      if (!chat) {
        chat = { id: nextId('chats'), productId: product.id, buyerId: user.id, sellerId: product.ownerId, createdAt: new Date().toISOString(), reads: {} };
        db.chats.push(chat);
        save();
      }
      return send(res, 201, summary(chat));
    }
    const chat = db.chats.find((x) => x.id === Number(b));
    if (!chat) fail(404, 'Чат не знайдено');
    if (!mine(chat)) fail(403, 'Це не ваш чат');

    if (c === 'messages' && method === 'GET') {
      const msgs = chatMsgs(chat);
      if (msgs.length) {
        chat.reads[user.id] = msgs[msgs.length - 1].id;
        save();
      }
      return send(res, 200, msgs.map((m) => ({ id: m.id, text: m.text, fromMe: m.fromUserId === user.id, createdAt: m.createdAt })));
    }
    if (c === 'messages' && method === 'POST') {
      const text = String(body.text ?? '').trim();
      if (!text) fail(400, 'Повідомлення порожнє');
      if (text.length > 1000) fail(400, 'Повідомлення задовге');
      const msg = { id: nextId('chatMessages'), chatId: chat.id, fromUserId: user.id, text, createdAt: new Date().toISOString() };
      db.chatMessages.push(msg);
      chat.reads[user.id] = msg.id;
      save();
      // сторонній продавець (без акаунта) відповідає автоматично
      if (chat.sellerId === 0 && chat.buyerId === user.id) {
        setTimeout(() => {
          const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
          db.chatMessages.push({ id: nextId('chatMessages'), chatId: chat.id, fromUserId: 0, text: reply, createdAt: new Date().toISOString() });
          save();
        }, 3000);
      }
      return send(res, 201, { id: msg.id, text: msg.text, fromMe: true, createdAt: msg.createdAt });
    }
  }

  // --- служба підтримки ---
  if (a === 'support' && method === 'POST') {
    if (String(body.name ?? '').trim().length < 2) fail(400, 'Вкажіть ім’я');
    if (!EMAIL_RE.test(String(body.email ?? '').trim())) fail(400, 'Введіть коректний email');
    if (String(body.message ?? '').trim().length < 10) fail(400, 'Опишіть питання (щонайменше 10 символів)');
    const ticket = { id: nextId('support'), name: body.name.trim(), email: body.email.trim(), topic: body.topic ?? '', message: body.message.trim(), createdAt: new Date().toISOString() };
    db.support.push(ticket);
    save();
    return send(res, 201, ticket);
  }

  return fail(404, 'Не знайдено');
}

http
  .createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      if (err instanceof HttpError) return send(res, err.status, { message: err.message });
      console.error(err);
      return send(res, 500, { message: 'Внутрішня помилка сервера' });
    }
  })
  .listen(PORT, () => console.log(`API: http://localhost:${PORT}/api`));
