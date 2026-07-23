import { useState, useEffect, useCallback } from 'react';
import { fetchStates } from '../api/states';

export const useStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStates = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStates(signal);
      setStates(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch states.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadStates(controller.signal);
    return () => {
      controller.abort();
    };
  }, [loadStates]);

  const handleRetry = () => {
    loadStates();
  };

  return { states, loading, error, retry: handleRetry };
};
