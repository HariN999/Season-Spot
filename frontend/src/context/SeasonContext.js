import React, { createContext, useContext, useState, useCallback } from 'react';

const SeasonContext = createContext(undefined);

const SEASONS = ['Winter', 'Spring', 'Summer', 'Monsoon'];

export function SeasonProvider({ children }) {
  const [season, setSeason] = useState(() => {
    // Auto-detect current season based on month
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Monsoon';
    if (month >= 8 && month <= 9) return 'Summer'; // post-monsoon warmth
    return 'Winter'; // Nov–Feb
  });

  const cycleSeason = useCallback(() => {
    setSeason(prev => {
      const idx = SEASONS.indexOf(prev);
      return SEASONS[(idx + 1) % SEASONS.length];
    });
  }, []);

  return (
    <SeasonContext.Provider value={{ season, setSeason, cycleSeason, seasons: SEASONS }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error('useSeason must be used within a SeasonProvider');
  }
  return context;
}

export { SEASONS };
export default SeasonContext;
