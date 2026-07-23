import { useState, useEffect } from 'react';
import { fetchStates } from '../api/states';

export const useStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStates();
      setStates(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch states.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStates();
  }, []);

  return { states, loading, error, retry: loadStates };
};
