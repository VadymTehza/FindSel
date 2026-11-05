import Button from './Button.jsx';
import ListingItem from './ListingItem.jsx';
import Tabs from './Tabs.jsx';
import { laptop } from '../data/products.js';

const TABS = [
  { key: 'road', label: 'В дорозі', count: 1 },
  { key: 'office', label: 'Очікується у відділенні', count: 1 },
  { key: 'done', label: 'Завершені', count: 10 },
];

export default function MyPurchases() {
  return (
    <>
      <h1>Мої покупки</h1>
      <Tabs tabs={TABS} active="road" label="Статус замовлень" />
      <ListingItem
        image={laptop.image}
        title={laptop.title}
        price={laptop.price}
        actions={
          <>
            <Button>Відстежити</Button>
            <Button to="/chats">Чат з продавцем</Button>
          </>
        }
      >
        <span>в дорозі FindGo-доставка</span>
        <small>ТТН: 20450893221</small>
      </ListingItem>
    </>
  );
}
