import Button from './Button.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import ListingItem from './ListingItem.jsx';
import { products } from '../data/products.js';
import styles from './FavoritesList.module.css';

export default function FavoritesList() {
  return (
    <>
      <h1>Обране</h1>
      <p className={styles.sub}>Збережені товари (2)</p>
      <div className={styles.list}>
        {products.slice(0, 2).map((p) => (
          <ListingItem
            key={p.id}
            image={p.image}
            title={p.title}
            price={p.price}
            actions={
              <>
                <Button variant="pill" to="/chats">
                  Написати
                </Button>
                <Button variant="pill" to="/cart">
                  Купити
                </Button>
                <FavoriteButton defaultLiked />
              </>
            }
          >
            <strong>Активне</strong>
            <span>Київ · Сьогодні</span>
          </ListingItem>
        ))}
      </div>
    </>
  );
}
