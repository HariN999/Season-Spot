import { apiFetch } from './client';

export const searchStates = async (query) => {
  return apiFetch(`/api/search?q=${encodeURIComponent(query)}`);
};
