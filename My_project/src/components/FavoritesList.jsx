import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice.js';
import { useFavorites } from '../context/useFavorites.js';
import { catalog } from '../data/products.js';
import FavoriteButton from './FavoriteButton.jsx';
import Button from './Button.jsx';
import ListingItem from './ListingItem.jsx';
import styles from './FavoritesList.module.css';

export default function FavoritesList() {
  const { favorites } = useFavorites();
  const items = favorites.map((id) => catalog.find((p) => p.id === id)).filter(Boolean);

  return (
    <>
      <h1>Обране</h1>
      <p className={styles.sub}>Збережені товари ({items.length})</p>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>Тут поки порожньо.</p>
          <p>Натисніть ♡ на товарі в каталозі, щоб зберегти його сюди.</p>
          <Link to="/"><Button variant="green">До каталогу</Button></Link>
        </div>
      ) : (
        <div className={styles.list}>
          {items.map((p) => (
            <ListingItem
              key={p.id}
              image={p.image}
              title={p.title}
              price={formatPrice(p.price)}
              actions={
                <>
                  <Link to="/chats"><Button variant="pill">Написати</Button></Link>
                  <Link to="/cart"><Button variant="pill">Купити</Button></Link>
                  <FavoriteButton id={p.id} />
                </>
              }
            >
              <strong>Активне</strong>
              <span>Київ · Сьогодні</span>
            </ListingItem>
          ))}
        </div>
      )}
    </>
  );
}
