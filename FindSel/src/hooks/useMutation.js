import { useCallback, useState } from 'react';
import { request } from '../api/client.js';

// Відправлення даних на сервер (POST / PATCH / DELETE)
export function useMutation(method = 'POST') {
  const [state, setState] = useState({ loading: false, error: null });

  const run = useCallback(
    async (path, body) => {
      setState({ loading: true, error: null });
      try {
        const data = await request(path, { method, body });
        setState({ loading: false, error: null });
        return data;
      } catch (error) {
        setState({ loading: false, error });
        throw error;
      }
    },
    [method]
  );

  return { run, ...state };
}

export const usePost = () => useMutation('POST');
export const usePatch = () => useMutation('PATCH');
