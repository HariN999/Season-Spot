import React from 'react';
import { Box, Typography, TextField, InputAdornment, Chip, Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { VIBES, SEASONS } from '../data/seasonalData';

const SEASON_ICONS = {
  Winter: <AcUnitIcon sx={{ color: '#00d2ff', fontSize: 16 }} />,
  Summer: <WbSunnyIcon sx={{ color: '#ffaa00', fontSize: 16 }} />,
  Monsoon: <ThunderstormIcon sx={{ color: '#00e676', fontSize: 16 }} />,
  Spring: <LocalFloristIcon sx={{ color: '#ff4081', fontSize: 16 }} />
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
    <Box className="hero-banner-wrapper">
      <Container maxWidth="lg">
        {/* Mobile Season Selector Bar */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {SEASONS.map(s => (
            <Chip
              key={s}
              icon={SEASON_ICONS[s]}
              label={s}
              size="small"
              onClick={() => onSelectSeason(s)}
              sx={{
                bgcolor: selectedSeason === s ? '#3a86ff' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: 700
              }}
            />
          ))}
        </Box>

        <Typography variant="overline" className="hero-badge">
          ✨ AI-POWERED SEASONAL DISCOVERY ENGINE
        </Typography>

        <Typography variant="h2" className="hero-headline">
          Experience India in Full Bloom. <br />
          <span className="gradient-text">Every Season.</span>
        </Typography>

        <Typography className="hero-subtext">
          Discover peak weather windows, authentic seasonal culinary dishes, and curated destinations across all 28 Indian states.
        </Typography>

        {/* Search Bar */}
        <Box className="hero-search-box">
          <TextField
            fullWidth
            placeholder="Search state (e.g. Goa, Telangana, Himachal Pradesh, Kerala...)"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#38bdf8', fontSize: 24 }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '35px',
                bgcolor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(20px)',
                color: '#fff',
                fontSize: '1.05rem',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: '#38bdf8' }
              }
            }}
          />
        </Box>

        {/* Vibe Chips */}
        <Box className="hero-vibe-chips">
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700 }}>
            Filter Destinations by Vibe
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            {VIBES.map(vibe => (
              <Chip
                key={vibe}
                label={vibe}
                size="medium"
                onClick={() => onSelectVibe(vibe)}
                className={`vibe-chip ${selectedVibe === vibe ? 'active' : ''}`}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  borderRadius: '20px',
                  bgcolor: selectedVibe === vibe ? 'linear-gradient(135deg, #3a86ff 0%, #4361ee 100%)' : 'rgba(255,255,255,0.06)',
                  color: selectedVibe === vibe ? '#fff' : 'rgba(255,255,255,0.85)',
                  border: selectedVibe === vibe ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(58, 134, 255, 0.3)', transform: 'translateY(-2px)' },
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
