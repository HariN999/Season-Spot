import { useState, useEffect } from 'react';
import { fetchStateDetails } from '../api/states';

export const useStateDetails = (stateName) => {
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!stateName) return;
    
    const controller = new AbortController();
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStateDetails(stateName, controller.signal);
        setStateData(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load state details.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
    return () => {
      controller.abort();
    };
  }, [stateName, refreshTrigger]);

  const retry = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { stateData, loading, error, retry };
};
