import { useState, useEffect } from 'react';
import { fetchStateDetails } from '../api/states';

export const useStateDetails = (stateName) => {
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!stateName) return;
    
    let isMounted = true;
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStateDetails(stateName);
        if (isMounted) {
          setStateData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load state details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [stateName, refreshTrigger]);

  const retry = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { stateData, loading, error, retry };
};
