import { useState } from 'react';
import { searchStates } from '../api/search';

export const useSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (query) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchStates(query);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Search execution failed.');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search: performSearch };
};
