import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip, Skeleton, Button, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ExploreIcon from '@mui/icons-material/Explore';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import VerifiedIcon from '@mui/icons-material/Verified';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import IndiaMap from './components/IndiaMap';
import ItineraryModal from './components/ItineraryModal';
import { getStateSeasonData } from './data/seasonalData';
import './App.css';

const DEFAULT_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function App() {
  const [states] = useState(DEFAULT_STATES);
  const [selectedState, setSelectedState] = useState('Telangana');
  const [selectedSeason, setSelectedSeason] = useState('Monsoon');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itineraryModalOpen, setItineraryModalOpen] = useState(false);

  // Instant data update (<50ms response)
  useEffect(() => {
    setLoading(true);
    // Instant local dataset lookup
    const localData = getStateSeasonData(selectedState, selectedSeason);
    
    // Add artificial short tick to give smooth micro-animation feel
    const timer = setTimeout(() => {
      setSuggestion({
        state: selectedState,
        season: selectedSeason,
        ...localData
      });
      setLoading(false);
    }, 80);

    return () => clearTimeout(timer);
  }, [selectedState, selectedSeason]);

  return (
    <Box className={`app-container ${selectedSeason}`}>
      <Container maxWidth="lg">
        <Header />

        <IndiaMap
          states={states}
          selectedState={selectedState}
          onSelectState={setSelectedState}
          selectedSeason={selectedSeason}
          onSelectSeason={setSelectedSeason}
          selectedVibe={selectedVibe}
          onSelectVibe={setSelectedVibe}
          onOpenItineraryModal={() => setItineraryModalOpen(true)}
        />

        <Box sx={{ mt: 4 }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <Loader key="loader" />
            ) : (
              suggestion && (
                <SuggestionHeroCard
                  key={`${selectedState}-${selectedSeason}`}
                  suggestion={suggestion}
                  onOpenItineraryModal={() => setItineraryModalOpen(true)}
                />
              )
            )}
          </AnimatePresence>
        </Box>

        <ItineraryModal
          open={itineraryModalOpen}
          onClose={() => setItineraryModalOpen(false)}
          state={selectedState}
          season={selectedSeason}
        />
      </Container>
    </Box>
  );
}

const Header = () => (
  <motion.div
    initial={{ y: -30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="header-wrapper"
  >
    <Typography component="h1" className="header-title">
      Season Spot
    </Typography>
    <Typography className="header-subtitle">
      Instant AI Travel & Culinary Decision Engine for Indian States
    </Typography>
  </motion.div>
);

const SuggestionHeroCard = ({ suggestion, onOpenItineraryModal }) => (
  <motion.div
    initial={{ scale: 0.96, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.96, opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="suggestion-hero-card">
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        {/* State Title & Badges */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
              {suggestion.state} in {suggestion.season}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(248, 250, 252, 0.8)', maxWidth: 700 }}>
              {suggestion.weatherDesc}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="secondary"
            onClick={onOpenItineraryModal}
            startIcon={<AutoAwesomeIcon />}
            sx={{
              borderRadius: '25px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              py: 1,
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
            }}
          >
            Generate 3-Day Plan
          </Button>
        </Box>

        <Box className="hero-badge-box">
          <Box className="score-badge">
            <VerifiedIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
            Suitability: {suggestion.suitabilityScore} / 10
          </Box>
          <Box className="temp-badge">
            <ThermostatIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle', color: '#ffb703' }} />
            Avg Temp: {suggestion.tempRange}
          </Box>
          <Chip label={`Vibe: ${suggestion.vibe || 'Heritage'}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700 }} />
        </Box>

        {/* Seasonal Food Section */}
        <Box sx={{ mt: 4 }}>
          <Typography className="section-title">
            <RestaurantIcon sx={{ color: '#f472b6' }} /> Seasonal Food & Culinary Highlights
          </Typography>

          <Grid container spacing={2}>
            {suggestion.food && suggestion.food.map((dish, i) => (
              <Grid item xs={12} sm={6} md={4} key={`food-${i}`}>
                <Card className="item-card">
                  <CardContent sx={{ p: 2.5 }}>
                    {dish.tag && <span className="dish-tag">{dish.tag}</span>}
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
                      {dish.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                      {dish.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Travel Locations Section */}
        <Box sx={{ mt: 4 }}>
          <Typography className="section-title">
            <ExploreIcon sx={{ color: '#38bdf8' }} /> Top Recommended Destinations
          </Typography>

          <Grid container spacing={2}>
            {suggestion.locations && suggestion.locations.map((loc, i) => (
              <Grid item xs={12} sm={6} md={4} key={`loc-${i}`}>
                <Card className="item-card">
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
                      {loc.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mb: 1.5 }}>
                      {loc.highlight}
                    </Typography>
                    {loc.bestTime && (
                      <Chip label={`Best: ${loc.bestTime}`} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Travel Essentials & Tips */}
        {suggestion.travelTips && suggestion.travelTips.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography className="section-title">
              <LightbulbIcon sx={{ color: '#ffb703' }} /> Travel Essentials & Packing Tips
            </Typography>
            <Grid container spacing={1.5}>
              {suggestion.travelTips.map((tip, i) => (
                <Grid item xs={12} md={4} key={`tip-${i}`}>
                  <Box className="tip-pill">
                    💡 {tip}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const Loader = () => (
  <Box sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 4 }}>
    <Skeleton variant="text" width="50%" height={50} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
    <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)' }} />
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={4}><Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)' }} /></Grid>
      <Grid item xs={4}><Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)' }} /></Grid>
      <Grid item xs={4}><Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.06)' }} /></Grid>
    </Grid>
  </Box>
);

export default App;
