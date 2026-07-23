import { apiFetch } from './client';

export const fetchStates = async () => {
  return apiFetch('/api/states');
};

export const fetchStateDetails = async (stateName) => {
  return apiFetch(`/api/states/${encodeURIComponent(stateName)}`);
};

export const fetchStateSeasonDetails = async (stateName, seasonName) => {
  return apiFetch(`/api/states/${encodeURIComponent(stateName)}/seasons/${encodeURIComponent(seasonName)}`);
};
