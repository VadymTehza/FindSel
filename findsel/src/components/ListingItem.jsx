import styles from './ListingItem.module.css';

/** Картка-рядок: фото + інформація + дії (оголошення, покупки, обране) */
export default function ListingItem({ image, title, price, children, actions }) {
  return (
    <article className={styles.item}>
      <img className={styles.img} src={image} alt={title} />
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        {children}
      </div>
      <div className={styles.side}>
        <p className={styles.price}>{price}</p>
        <div className={styles.actions}>{actions}</div>
      </div>
    </article>
  );
}
