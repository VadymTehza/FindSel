import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import { usePatch } from '../hooks/useMutation.js';
import { formatPrice } from '../utils/formatPrice.js';
import Button from './Button.jsx';
import { EditListingDialog, PromoDialog } from './ListingDialogs.jsx';
import ListingItem from './ListingItem.jsx';
import Status from './Status.jsx';
import Tabs from './Tabs.jsx';
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

export default function MyListings() {
  const location = useLocation();
  const { data, loading, error, refetch } = useFetch('/products?owner=me');
  const patch = usePatch();
  const [tab, setTab] = useState('active');
  const [dialog, setDialog] = useState(null); // { type: 'promo' | 'edit', id }
  const [notice, setNotice] = useState(location.state?.notice ?? '');
  const [failure, setFailure] = useState('');

  const listings = data ?? [];
  const tabs = TABS.map((t) => ({
    ...t,
    count: listings.filter((l) => l.status === t.key).length,
  }));
  const visible = listings.filter((l) => l.status === tab);
  const target = dialog ? listings.find((l) => l.id === dialog.id) : null;

  // PATCH на сервер, потім оновлення списку
  const update = async (id, body, message) => {
    setFailure('');
    try {
      await patch.run(`/products/${id}`, body);
      setNotice(message);
      setDialog(null);
      refetch();
    } catch (err) {
      setFailure(err.message);
    }
  };

  const changeTab = (key) => {
    setTab(key);
    setNotice('');
    setFailure('');
  };

  const renderActions = (l) => (
    <>
      {l.status === 'active' && (
        <Button variant="green" onClick={() => setDialog({ type: 'promo', id: l.id })}>
          Рекламувати
        </Button>
      )}
      <Button onClick={() => setDialog({ type: 'edit', id: l.id })}>Редагувати</Button>
      {l.status === 'active' && (
        <Button
          variant="outline"
          onClick={() => update(l.id, { status: 'inactive' }, `«${l.title}» перенесено до неактивних.`)}
        >
          Деактивувати
        </Button>
      )}
      {l.status === 'inactive' && (
        <Button
          variant="outline"
          onClick={() => update(l.id, { status: 'active' }, `«${l.title}» знову активне.`)}
        >
          Активувати
        </Button>
      )}
    </>
  );

  return (
    <>
      <h1>Мої оголошення</h1>
      <Tabs tabs={tabs} active={tab} onChange={changeTab} label="Статус оголошень" />
      {notice && (
        <p role="status" className={styles.notice}>
          {notice}
        </p>
      )}
      {failure && (
        <p role="alert" className={styles.failure}>
          {failure}
        </p>
      )}

      <div role="tabpanel" className={styles.list}>
        <Status loading={loading} error={error} onRetry={refetch}>
          {visible.length === 0 ? (
            <div className={styles.empty}>
              <p>{EMPTY_TEXT[tab]}</p>
              {tab === 'active' && (
                <Button variant="green" to="/create">
                  Створити оголошення
                </Button>
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
                <strong className={styles[STATUS[l.status].className]}>{STATUS[l.status].label}</strong>
                <small>
                  Переглядів: {l.views} · В обраному: {l.favorites}
                </small>
                {l.promo && (
                  <span className={styles.promo}>
                    {l.promo.label} до {new Date(l.promo.until).toLocaleDateString('uk-UA')}
                  </span>
                )}
                <Link to={`/product/${l.id}`}>Переглянути на сайті</Link>
              </ListingItem>
            ))
          )}
        </Status>
      </div>

      {target && dialog.type === 'promo' && (
        <PromoDialog
          listing={{ ...target }}
          onClose={() => setDialog(null)}
          onConfirm={(plan) =>
            update(target.id, { promo: { label: plan.label, days: plan.days } }, `Оголошення «${target.title}» рекламується: ${plan.label}.`)
          }
        />
      )}
      {target && dialog.type === 'edit' && (
        <EditListingDialog
          listing={target}
          onClose={() => setDialog(null)}
          onSave={(body) => update(target.id, body, `Зміни до «${body.title}» збережено.`)}
        />
      )}
    </>
  );
}
