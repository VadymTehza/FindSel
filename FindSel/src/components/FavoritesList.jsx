import { useFavorites } from '../context/useFavorites.js';
import { useStartChat } from '../hooks/useStartChat.js';
import { useFetch } from '../hooks/useFetch.js';
import { formatPrice } from '../utils/formatPrice.js';
import Button from './Button.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import ListingItem from './ListingItem.jsx';
import Status from './Status.jsx';
import styles from './FavoritesList.module.css';

export default function FavoritesList() {
  const { favorites } = useFavorites();
  const { start } = useStartChat();
  const path = favorites.length ? `/products?ids=${favorites.join(',')}` : null;
  const { data, loading, error, refetch } = useFetch(path);
  const items = path ? (data ?? []).filter((p) => favorites.includes(p.id)) : [];

  return (
    <>
      <h1>Обране</h1>
      <p className={styles.sub}>Збережені товари ({favorites.length})</p>
      <Status loading={loading && items.length === 0} error={error} onRetry={refetch}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Тут поки порожньо.</p>
            <p>Натисніть ♡ на товарі в каталозі, щоб зберегти його сюди.</p>
            <Button variant="green" to="/">
              До каталогу
            </Button>
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
                    <Button variant="pill" onClick={() => start(p.id)}>
                      Написати
                    </Button>
                    <Button variant="pill" to={`/product/${p.id}`}>
                      Переглянути
                    </Button>
                    <FavoriteButton id={p.id} />
                  </>
                }
              >
                <strong>Активне</strong>
                <span>{p.city}</span>
              </ListingItem>
            ))}
          </div>
        )}
      </Status>
    </>
  );
}
