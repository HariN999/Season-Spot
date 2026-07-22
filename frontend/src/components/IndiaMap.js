import React, { useState } from 'react';
import { Box, Chip, TextField, InputAdornment, Typography, Card, CardMedia, CardContent, Grid, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { VIBES, SEASONS, TOP_SPOTLIGHTS } from '../data/seasonalData';

const SEASON_ICONS = {
  Winter: <AcUnitIcon sx={{ color: '#00d2ff' }} />,
  Summer: <WbSunnyIcon sx={{ color: '#ffaa00' }} />,
  Monsoon: <ThunderstormIcon sx={{ color: '#00e676' }} />,
  Spring: <LocalFloristIcon sx={{ color: '#ff4081' }} />
};

export default function IndiaMap({
  states,
  selectedState,
  onSelectState,
  selectedSeason,
  onSelectSeason,
  selectedVibe,
  onSelectVibe,
  onOpenItineraryModal
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStates = states.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="selector-section-wrapper">
      {/* Top Banner & Season Selector Pills */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>
          Select Season
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {SEASONS.map(s => {
            const isSelected = selectedSeason === s;
            return (
              <Chip
                key={s}
                icon={SEASON_ICONS[s]}
                label={s}
                onClick={() => onSelectSeason(s)}
                className={`season-chip ${isSelected ? 'active' : ''}`}
                sx={{
                  px: 2,
                  py: 2.5,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* Vibe Category Filters */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1, textAlign: 'center' }}>
          Filter by Travel Vibe
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          {VIBES.map(vibe => (
            <Chip
              key={vibe}
              label={vibe}
              size="small"
              onClick={() => onSelectVibe(vibe)}
              sx={{
                bgcolor: selectedVibe === vibe ? 'primary.main' : 'rgba(255,255,255,0.08)',
                color: selectedVibe === vibe ? '#fff' : 'rgba(255,255,255,0.8)',
                fontWeight: 600,
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* State Search Input */}
      <Box sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search Indian State (e.g. Telangana, Goa, Kerala...)"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          variant="outlined"
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '25px',
              bgcolor: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover fieldset': { borderColor: 'primary.light' }
            }
          }}
        />
      </Box>

      {/* Quick State Pills */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', maxHeight: 150, overflowY: 'auto', p: 1, mb: 4, scrollbarWidth: 'thin' }}>
        {filteredStates.map(st => {
          const isSelected = selectedState === st;
          return (
            <Chip
              key={st}
              label={st}
              onClick={() => onSelectState(st)}
              sx={{
                bgcolor: isSelected ? '#3a86ff' : 'rgba(255,255,255,0.05)',
                color: isSelected ? '#fff' : 'rgba(255,255,255,0.85)',
                fontWeight: isSelected ? 700 : 500,
                border: isSelected ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(58, 134, 255, 0.4)', transform: 'translateY(-2px)' },
                transition: 'all 0.2s ease'
              }}
            />
          );
        })}
      </Box>

      {/* Top Spotlight Recommendations Bar */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon sx={{ color: '#ffb703' }} /> Top Recommended Places for {selectedSeason}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={onOpenItineraryModal}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(255, 0, 110, 0.4)'
            }}
          >
            ✨ AI 3-Day Itinerary Planner
          </Button>
        </Box>

        <Grid container spacing={2}>
          {TOP_SPOTLIGHTS.map(spot => (
            <Grid item xs={12} sm={6} md={3} key={`${spot.state}-${spot.season}`}>
              <Card
                onClick={() => {
                  onSelectState(spot.state);
                  onSelectSeason(spot.season);
                }}
                className="spotlight-card"
                sx={{
                  borderRadius: 3,
                  cursor: 'pointer',
                  bgcolor: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: '#3a86ff',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
                  }
                }}
              >
                <CardMedia component="img" height="120" image={spot.image} alt={spot.state} />
                <CardContent sx={{ p: 2, color: '#fff' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon fontSize="small" color="error" /> {spot.state}
                    </Typography>
                    <Chip label={`${spot.score}/10`} size="small" sx={{ bgcolor: '#2a9d8f', color: '#fff', fontWeight: 800, height: 20 }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>
                    {spot.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
