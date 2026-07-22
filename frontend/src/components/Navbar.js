import React from 'react';
import { Box, Typography, Chip, Container, Button } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { SEASONS } from '../data/seasonalData';

const SEASON_ICONS = {
  Winter: <AcUnitIcon sx={{ color: '#00d2ff', fontSize: 18 }} />,
  Summer: <WbSunnyIcon sx={{ color: '#ffaa00', fontSize: 18 }} />,
  Monsoon: <ThunderstormIcon sx={{ color: '#00e676', fontSize: 18 }} />,
  Spring: <LocalFloristIcon sx={{ color: '#ff4081', fontSize: 18 }} />
};

export default function Navbar({ selectedSeason, onSelectSeason, onOpenItineraryModal }) {
  return (
    <Box className="official-navbar">
      <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
        {/* Brand Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Box className="brand-icon-box">
            <ExploreIcon sx={{ color: '#fff', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" className="brand-logo-text">
              Season Spot
            </Typography>
            <Typography variant="caption" className="brand-tagline">
              India Seasonal Guide
            </Typography>
          </Box>
        </Box>

        {/* Season Switcher Pills in Navbar */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.06)', p: 0.8, borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
          {SEASONS.map(s => {
            const isSelected = selectedSeason === s;
            return (
              <Chip
                key={s}
                icon={SEASON_ICONS[s]}
                label={s}
                onClick={() => onSelectSeason(s)}
                className={`nav-season-chip ${isSelected ? 'active' : ''}`}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  px: 1,
                  py: 1.8,
                  borderRadius: '20px',
                  bgcolor: isSelected ? 'primary.main' : 'transparent',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              />
            );
          })}
        </Box>

        {/* Action Button */}
        <Button
          variant="contained"
          className="nav-ai-btn"
          onClick={onOpenItineraryModal}
          startIcon={<AutoAwesomeIcon />}
          sx={{
            borderRadius: '25px',
            textTransform: 'none',
            fontWeight: 700,
            px: 2.5,
            py: 0.9,
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
          }}
        >
          AI Itinerary
        </Button>
      </Container>
    </Box>
  );
}
