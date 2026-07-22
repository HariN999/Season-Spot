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
  Winter: <AcUnitIcon sx={{ color: '#38bdf8', fontSize: 16 }} />,
  Summer: <WbSunnyIcon sx={{ color: '#f59e0b', fontSize: 16 }} />,
  Monsoon: <ThunderstormIcon sx={{ color: '#10b981', fontSize: 16 }} />,
  Spring: <LocalFloristIcon sx={{ color: '#ec4899', fontSize: 16 }} />
};

export default function Navbar({ selectedSeason, onSelectSeason, onOpenItineraryModal }) {
  return (
    <Box className="editorial-navbar">
      <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
        {/* Brand Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Box className="brand-icon-box">
            <ExploreIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography className="brand-logo-text">
              Season Spot
            </Typography>
            <Typography className="brand-tagline">
              Editorial Travel & Culinary Engine
            </Typography>
          </Box>
        </Box>

        {/* Season Switcher Pills */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.04)', p: 0.8, borderRadius: '30px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {SEASONS.map(s => {
            const isSelected = selectedSeason === s;
            return (
              <Chip
                key={s}
                icon={SEASON_ICONS[s]}
                label={s}
                onClick={() => onSelectSeason(s)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  px: 1,
                  py: 1.8,
                  borderRadius: '20px',
                  bgcolor: isSelected ? '#f59e0b' : 'transparent',
                  color: isSelected ? '#0b0f19' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease'
                }}
              />
            );
          })}
        </Box>

        {/* Action Button */}
        <Button
          variant="contained"
          onClick={onOpenItineraryModal}
          startIcon={<AutoAwesomeIcon sx={{ color: '#f59e0b' }} />}
          sx={{
            borderRadius: '25px',
            textTransform: 'none',
            fontWeight: 700,
            px: 2.5,
            py: 0.9,
            bgcolor: 'rgba(245, 158, 11, 0.12)',
            color: '#f59e0b',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#f59e0b',
              color: '#0b0f19',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
            }
          }}
        >
          Craft 3-Day Itinerary
        </Button>
      </Container>
    </Box>
  );
}
