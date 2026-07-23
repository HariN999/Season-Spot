import { apiFetch } from './client';

export const fetchStates = async (signal) => {
  return apiFetch('/api/states', { signal });
};

export const fetchStateDetails = async (stateName, signal) => {
  return apiFetch(`/api/states/${encodeURIComponent(stateName)}`, { signal });
};

export const fetchStateSeasonDetails = async (stateName, seasonName, signal) => {
  return apiFetch(`/api/states/${encodeURIComponent(stateName)}/seasons/${encodeURIComponent(seasonName)}`, { signal });
};
