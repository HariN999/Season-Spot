import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, Skeleton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// --- Main App Component ---
function App() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  // Default to Monsoon, as it is currently August 27, 2025, in Hyderabad
  const [selectedSeason, setSelectedSeason] = useState('Monsoon');
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const seasons = ["Winter", "Spring", "Summer", "Monsoon"];

  // Fetch states on initial load
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/states`)
      .then(res => res.json())
      .then(data => {
        setStates(data);
        // Default to the current location, Telangana
        setSelectedState('Telangana');
      });
  }, []);

  // Fetch suggestions when state or season changes
  useEffect(() => {
    if (selectedState && selectedSeason) {
      setLoading(true);
      setError('');
      setSuggestion(null);

      fetch(`${process.env.REACT_APP_API_URL}/api/info?state=${selectedState}&season=${selectedSeason}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
            setSuggestion(null);
          } else {
            setSuggestion(data[0]);
          }
          setLoading(false);
        });
    }
  }, [selectedState, selectedSeason]);

  return (
    <Box className="app-container">
      <Header />
      
      <Box className="selectors-container">
        <FormControl fullWidth>
          {/* FIX: Corrected the closing tag below */}
          <InputLabel>State</InputLabel>
          <Select value={selectedState} label="State" onChange={(e) => setSelectedState(e.target.value)}>
            {states.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Season</InputLabel>
          <Select value={selectedSeason} label="Season" onChange={(e) => setSelectedSeason(e.target.value)}>
            {seasons.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Box className="results-container">
        <AnimatePresence>
          {loading && <Loader />}
          {error && <Typography color="error" textAlign="center">{error}</Typography>}
          {suggestion && <SuggestionCard suggestion={suggestion} />}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

// --- Sub-Components for a Clean Structure ---

const Header = () => (
  <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
    <header className="header">
      <h1>Season Spot</h1>
      <p>AI-Powered Seasonal Travel & Food Guide for India</p>
    </header>
  </motion.div>
);

const SuggestionCard = ({ suggestion }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="div">{suggestion.season} Suggestions</Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>Seasonal Food</Typography>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {suggestion.food.map((item, index) => (
              <li key={`food-${index}`}><Typography variant="body1">{item}</Typography></li>
            ))}
          </ul>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>Travel Locations</Typography>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {suggestion.locations.map((item, index) => (
              <li key={`loc-${index}`}><Typography variant="body1">{item}</Typography></li>
            ))}
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
