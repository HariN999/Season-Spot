import { apiFetch } from './client';

export const generateItinerary = async (params) => {
  return apiFetch('/api/planner/itinerary', {
    method: 'POST',
    body: JSON.stringify(params),
    timeout: 45000, // Extend timeout for LLM requests (45s max)
  });
};
