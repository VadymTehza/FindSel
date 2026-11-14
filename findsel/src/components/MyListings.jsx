import Button from './Button.jsx';
import ListingItem from './ListingItem.jsx';
import Tabs from './Tabs.jsx';
import { laptop } from '../data/products.js';
import styles from './MyListings.module.css';

const TABS = [
  { key: 'active', label: 'Активні', count: 1 },
  { key: 'moderation', label: 'На модерації', count: 1 },
  { key: 'inactive', label: 'Неактивні', count: 10 },
];

export default function MyListings() {
  return (
    <>
      <h1>Мої оголошення</h1>
      <Tabs tabs={TABS} active="active" label="Статус оголошень" />
      <div className={styles.list}>
        <ListingItem
          image={laptop.image}
          title={laptop.title}
          price={laptop.price}
          actions={
            <>
              <Button variant="green">Рекламувати</Button>
              <Button>Редагувати</Button>
            </>
          }
        >
          <strong className={styles.active}>Активно</strong>
          <small>142 перегляди · 18 в обраному</small>
        </ListingItem>
      </div>
    </>
  );
}
