import { useCallback, useEffect, useRef, useState } from 'react';
import { request } from '../api/client.js';

// Отримання даних із сервера: GET-запит, стани loading / error, повторний запит.
// Параметр interval (мс) вмикає тихе оновлення даних через заданий час.
export function useFetch(path, { interval } = {}) {
  const [state, setState] = useState({
    data: null,
    loading: Boolean(path),
    error: null,
  });
  const [tick, setTick] = useState(0);
  const silent = useRef(false);

  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: null });
      return undefined;
    }
    const quiet = silent.current;
    silent.current = false;
    const controller = new AbortController();
    if (!quiet) setState((s) => ({ ...s, loading: true, error: null }));
    request(path, { signal: controller.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError' || quiet) return;
        setState({ data: null, loading: false, error });
      });
    return () => controller.abort();
  }, [path, tick]);

  useEffect(() => {
    if (!interval || !path) return undefined;
    const id = setInterval(() => {
      silent.current = true;
      setTick((t) => t + 1);
    }, interval);
    return () => clearInterval(id);
  }, [interval, path]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, refetch };
}
