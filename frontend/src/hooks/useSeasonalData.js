import { useMemo } from 'react';
import { getStateSeasonData } from '../data/seasonalData';
import { STATE_IMAGES, DEFAULT_IMAGE } from '../data/stateImages';

const ALL_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export function useSeasonalData(season) {
  const statesWithData = useMemo(() => {
    return ALL_STATES.map(name => {
      const data = getStateSeasonData(name, season);
      return {
        name,
        image: STATE_IMAGES[name] || DEFAULT_IMAGE,
        ...data,
      };
    });
  }, [season]);

  const getTopRated = useMemo(() => {
    return [...statesWithData]
      .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
      .slice(0, 4);
  }, [statesWithData]);

  const filterByVibe = useMemo(() => {
    return (vibe) => {
      if (vibe === 'All') return statesWithData;
      return statesWithData.filter(s => s.vibe === vibe);
    };
  }, [statesWithData]);

  const searchStates = useMemo(() => {
    return (query) => {
      if (!query.trim()) return statesWithData;
      const q = query.toLowerCase();
      return statesWithData.filter(s => s.name.toLowerCase().includes(q));
    };
  }, [statesWithData]);

  const getStateData = (stateName) => {
    return statesWithData.find(s => s.name === stateName) || null;
  };

  const getSeasonComparison = (stateName) => {
    const seasons = ['Winter', 'Spring', 'Summer', 'Monsoon'];
    return seasons.map(s => ({
      season: s,
      ...getStateSeasonData(stateName, s),
    }));
  };

  const getNearbyStates = (stateName) => {
    // Simple approach: return 3 states with same vibe in current season
    const current = getStateData(stateName);
    if (!current) return [];
    return statesWithData
      .filter(s => s.name !== stateName && s.vibe === current.vibe)
      .slice(0, 3);
  };

  const getCuisineHighlights = useMemo(() => {
    const allDishes = [];
    statesWithData.forEach(state => {
      if (state.food) {
        state.food.forEach(dish => {
          allDishes.push({ ...dish, stateName: state.name });
        });
      }
    });
    // Return 6 random-ish highlights
    return allDishes.slice(0, 6);
  }, [statesWithData]);

  return {
    allStates: ALL_STATES,
    statesWithData,
    topRated: getTopRated,
    filterByVibe,
    searchStates,
    getStateData,
    getSeasonComparison,
    getNearbyStates,
    cuisineHighlights: getCuisineHighlights,
  };
}
