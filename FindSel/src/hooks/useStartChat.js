import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { usePost } from './useMutation.js';

// «Написати продавцю»: створює (або знаходить) чат і відкриває його
export function useStartChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const post = usePost();
  const [error, setError] = useState('');

  const start = async (productId) => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    setError('');
    try {
      const chat = await post.run('/chats', { productId });
      navigate(`/chats?chat=${chat.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return { start, error, loading: post.loading };
}
