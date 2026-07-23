import { apiFetch } from './client';

export const compareStates = async (stateNames) => {
  return apiFetch('/api/compare', {
    method: 'POST',
    body: JSON.stringify({ states: stateNames }),
  });
};
