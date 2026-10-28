export const chats = [
  {
    id: 1, name: 'Лайк шоп', color: '#f4512c', time: '12:40', unread: 2,
    product: { title: 'Ноутбук Asus', price: '18 500грн' },
    messages: [
      { id: 1, from: 'them', text: 'Доброго дня! Ноутбук ще в наявності.', time: '12:31' },
      { id: 2, from: 'me', text: 'Привіт! Чи можна оглянути його сьогодні?', time: '12:35' },
      { id: 3, from: 'them', text: 'Так, можемо зустрітись після 17:00 або відправити FindGo-доставкою.', time: '12:40' },
    ],
  },
  {
    id: 2, name: 'Олена К.', color: '#1f5fe6', time: 'Вчора', unread: 0,
    product: { title: 'Велосипед', price: '12 000грн' },
    messages: [
      { id: 1, from: 'me', text: 'Скільки років велосипеду?', time: '18:02' },
      { id: 2, from: 'them', text: 'Два роки, їздила на ньому лише влітку.', time: '18:10' },
    ],
  },
  {
    id: 3, name: 'TechStore Київ', color: '#12b76a', time: 'Пн', unread: 0,
    product: { title: 'Iphone 15 pro 6/256gb grey', price: '25 400грн' },
    messages: [
      { id: 1, from: 'them', text: 'Телефон з гарантією 12 місяців.', time: '10:15' },
    ],
  },
];
