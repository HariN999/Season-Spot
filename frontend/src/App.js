import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, Skeleton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('Monsoon');
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const seasons = ["Winter", "Spring", "Summer", "Monsoon"];

  // --- Fetch states ---
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/states`)
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => {
        setStates(data);
        setSelectedState('Telangana');
      })
      .catch(err => {
        console.error("Failed to fetch states:", err);
        setError("Could not connect to the server.");
        setLoading(false);
      });
  }, []);

  // --- Fetch suggestions ---
  useEffect(() => {
    if (!selectedState || !selectedSeason) return;
    setLoading(true);
    setError('');
    setSuggestion(null);

    fetch(`${process.env.REACT_APP_API_URL}/api/info?state=${selectedState}&season=${selectedSeason}`)
      .then(async res => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          console.warn("Failed to parse JSON, returning fallback.");
          return [{ state: selectedState, season: selectedSeason, food: [], locations: [] }];
        }
      })
      .then(data => {
        setSuggestion(data[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch suggestions:", err);
        setError("An error occurred while fetching suggestions.");
        setLoading(false);
      });
  }, [selectedState, selectedSeason]);

  return (
    <Box className="app-container">
      <Header />
      <Box className="selectors-container">
        <FormControl fullWidth>
          <InputLabel>State</InputLabel>
          <Select 
            value={selectedState} 
            label="State" 
            onChange={e => setSelectedState(e.target.value)}
            disabled={states.length === 0}
          >
            {states.length > 0 ? states.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>) :
            <MenuItem disabled>Loading states...</MenuItem>}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Season</InputLabel>
          <Select value={selectedSeason} label="Season" onChange={e => setSelectedSeason(e.target.value)}>
            {seasons.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Box className="results-container">
        <AnimatePresence>
          {loading && <Loader />}
          {error && <Typography color="error" textAlign="center" sx={{ mt: 2 }}>{error}</Typography>}
          {suggestion && <SuggestionCard suggestion={suggestion} />}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

const Header = () => (
  <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
    <header className="header">
      <h1>Season Spot</h1>
      <p>AI-Powered Seasonal Travel & Food Guide for India</p>
    </header>
  </motion.div>
);

const SuggestionCard = ({ suggestion }) => (
  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.4 }}>
    <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5">{suggestion.season} Suggestions</Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" color="primary">Seasonal Food</Typography>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {suggestion.food.map((item, i) => <li key={`food-${i}`}><Typography>{item}</Typography></li>)}
          </ul>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" color="primary">Travel Locations</Typography>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {suggestion.locations.map((item, i) => <li key={`loc-${i}`}><Typography>{item}</Typography></li>)}
          </ul>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

const Loader = () => (
  <Box>
    <Skeleton variant="text" width="40%" height={40} />
    <Skeleton variant="rectangular" width="100%" height={150} sx={{ mt: 2, borderRadius: 2 }} />
  </Box>
);

export default App;
