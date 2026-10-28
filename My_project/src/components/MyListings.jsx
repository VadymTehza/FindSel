import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button.jsx';
import ListingItem from './ListingItem.jsx';
import Tabs from './Tabs.jsx';
import { EditListingDialog, PromoDialog } from './ListingDialogs.jsx';
import { formatPrice } from '../utils/formatPrice.js';
import styles from './MyListings.module.css';

const TABS = [
  { key: 'active', label: 'Активні' },
  { key: 'moderation', label: 'На модерації' },
  { key: 'inactive', label: 'Неактивні' },
];

const STATUS = {
  active: { label: 'Активно', className: 'active' },
  moderation: { label: 'На модерації', className: 'moderation' },
  inactive: { label: 'Неактивне', className: 'inactive' },
};

const EMPTY_TEXT = {
  active: 'Активних оголошень поки немає.',
  moderation: 'Оголошень на модерації немає.',
  inactive: 'Неактивних оголошень немає.',
};

export default function MyListings({ listings, onUpdate }) {
  const [tab, setTab] = useState('active');
  const [dialog, setDialog] = useState(null); // { type: 'promo' | 'edit', id }
  const [notice, setNotice] = useState('');

  const tabs = TABS.map((t) => ({
    ...t,
    count: listings.filter((l) => l.status === t.key).length,
  }));
  const visible = listings.filter((l) => l.status === tab);
  const target = dialog ? listings.find((l) => l.id === dialog.id) : null;
  const closeDialog = () => setDialog(null);

  const changeTab = (key) => {
    setTab(key);
    setNotice('');
  };

  const promote = (plan) => {
    const until = new Date();
    until.setDate(until.getDate() + plan.days);
    onUpdate(target.id, {
      promo: { label: plan.label, until: until.toISOString() },
    });
    setNotice(`Оголошення «${target.title}» рекламується: ${plan.label}.`);
    closeDialog();
  };

  const save = (patch) => {
    onUpdate(target.id, patch);
    setNotice(`Зміни до «${patch.title}» збережено.`);
    closeDialog();
  };

  const changeStatus = (listing, status, message) => {
    onUpdate(listing.id, { status });
    setNotice(message);
  };

  const renderActions = (l) => (
    <>
      {l.status === 'active' && (
        <Button
          variant="green"
          onClick={() => setDialog({ type: 'promo', id: l.id })}
        >
          Рекламувати
        </Button>
      )}
      <Button onClick={() => setDialog({ type: 'edit', id: l.id })}>
        Редагувати
      </Button>
      {l.status === 'active' && (
        <Button
          variant="outline"
          onClick={() =>
            changeStatus(
              l,
              'inactive',
              `«${l.title}» перенесено до неактивних.`
            )
          }
        >
          Деактивувати
        </Button>
      )}
      {l.status === 'inactive' && (
        <Button
          variant="outline"
          onClick={() =>
            changeStatus(l, 'active', `«${l.title}» знову активне.`)
          }
        >
          Активувати
        </Button>
      )}
    </>
  );

  return (
    <>
      <h1>Мої оголошення</h1>
      <Tabs
        tabs={tabs}
        active={tab}
        onChange={changeTab}
        label="Статус оголошень"
      />
      {notice && (
        <p role="status" className={styles.notice}>
          {notice}
        </p>
      )}

      <div role="tabpanel" className={styles.list}>
        {visible.length === 0 ? (
          <div className={styles.empty}>
            <p>{EMPTY_TEXT[tab]}</p>
            {tab === 'active' && (
              <Link to="/create">
                <Button variant="green">Створити оголошення</Button>
              </Link>
            )}
          </div>
        ) : (
          visible.map((l) => (
            <ListingItem
              key={l.id}
              image={l.image}
              title={l.title}
              price={formatPrice(l.price)}
              actions={renderActions(l)}
            >
              <strong className={styles[STATUS[l.status].className]}>
                {STATUS[l.status].label}
              </strong>
              <small>
                Переглядів: {l.views} · В обраному: {l.favorites}
              </small>
              {l.promo && (
                <span className={styles.promo}>
                  {l.promo.label} до{' '}
                  {new Date(l.promo.until).toLocaleDateString('uk-UA')}
                </span>
              )}
            </ListingItem>
          ))
        )}
      </div>

      {target && dialog.type === 'promo' && (
        <PromoDialog
          listing={target}
          onClose={closeDialog}
          onConfirm={promote}
        />
      )}
      {target && dialog.type === 'edit' && (
        <EditListingDialog
          listing={target}
          onClose={closeDialog}
          onSave={save}
        />
      )}
    </>
  );
}
