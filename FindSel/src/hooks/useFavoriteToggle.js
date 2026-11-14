import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { useFavorites } from '../context/useFavorites.js';

// Серце «в обране»: гостя відправляє на сторінку входу
export function useFavoriteToggle(id) {
  const { user } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const onToggle = () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    toggle(id);
  };
  return { liked: isFavorite(id), onToggle };
}
