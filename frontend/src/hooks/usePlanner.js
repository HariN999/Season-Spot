import { useState } from 'react';
import { generateItinerary } from '../api/planner';

export const usePlanner = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildPlan = async (params) => {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const data = await generateItinerary(params);
      setPlan(data.plan);
      return data.plan;
    } catch (err) {
      setError(err.message || 'Failed to generate itinerary.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPlan(null);
  };

  return { plan, loading, error, generate: buildPlan, reset };
};
