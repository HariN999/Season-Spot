import React from 'react';
import { Box, Typography, TextField, InputAdornment, Chip, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { VIBES, SEASONS } from '../data/seasonalData';

const SEASON_ICONS = {
  Winter: <AcUnitIcon sx={{ color: '#38bdf8', fontSize: 16 }} />,
  Summer: <WbSunnyIcon sx={{ color: '#f59e0b', fontSize: 16 }} />,
  Monsoon: <ThunderstormIcon sx={{ color: '#10b981', fontSize: 16 }} />,
  Spring: <LocalFloristIcon sx={{ color: '#ec4899', fontSize: 16 }} />
};

export default function Hero({
  searchTerm,
  onSearchChange,
  selectedVibe,
  onSelectVibe,
  selectedSeason,
  onSelectSeason
}) {
  return (
    <Box className="editorial-hero-wrapper">
      <Container maxWidth="lg">
        {/* Mobile Season Selector Pills */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {SEASONS.map(s => (
            <Chip
              key={s}
              icon={SEASON_ICONS[s]}
              label={s}
              size="small"
              onClick={() => onSelectSeason(s)}
              sx={{
                bgcolor: selectedSeason === s ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontWeight: 700
              }}
            />
          ))}
        </Box>

        <Typography variant="overline" className="hero-overline-badge">
          CURATED SEASONAL TRAVEL & CULINARY ENGINE
        </Typography>

        <Typography variant="h2" className="hero-headline">
          Discover India at Its Most Beautiful. <br />
          <span className="serif-italic">{selectedSeason} Destinations.</span>
        </Typography>

        <Typography className="hero-subtext">
          Explore optimal weather windows, authentic regional specialties, and top-rated travel locations tailored for every season.
        </Typography>

        {/* Search Bar */}
        <Box className="hero-search-box">
          <TextField
            fullWidth
            placeholder="Search state (e.g. Goa, Telangana, Kerala, Himachal Pradesh...)"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#f59e0b', fontSize: 22 }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '30px',
                bgcolor: 'rgba(18, 24, 38, 0.85)',
                backdropFilter: 'blur(20px)',
                color: '#fff',
                fontSize: '1rem',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                '&:hover fieldset': { borderColor: '#f59e0b' }
              }
            }}
          />
        </Box>

        {/* Vibe Filter Chips */}
        <Box>
          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, fontSize: '0.72rem' }}>
            Filter Destinations by Travel Vibe
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            {VIBES.map(vibe => (
              <Chip
                key={vibe}
                label={vibe}
                onClick={() => onSelectVibe(vibe)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  borderRadius: '20px',
                  bgcolor: selectedVibe === vibe ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                  color: selectedVibe === vibe ? '#0b0f19' : 'rgba(255,255,255,0.85)',
                  border: selectedVibe === vibe ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                  '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.3)', color: '#fff' },
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
