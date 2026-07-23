import { useState } from 'react';
import { compareStates } from '../api/compare';

export const useCompare = () => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runComparison = async (stateNames) => {
    if (!stateNames || stateNames.length < 2) {
      setError('Select at least 2 states to compare.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await compareStates(stateNames);
      setComparison(data.comparison);
      return data.comparison;
    } catch (err) {
      setError(err.message || 'Comparison failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { comparison, loading, error, compare: runComparison };
};
