import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, InputAdornment,
  Grid, Card, CardMedia, CardContent, Chip, Button, IconButton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useSeason } from '../context/SeasonContext';
import { useSeasonalData } from '../hooks/useSeasonalData';
import { useFavorites } from '../hooks/useLocalStorage';
import { VIBES } from '../data/seasonalData';
import ScoreBadge from '../components/shared/ScoreBadge';
import SectionHeading from '../components/shared/SectionHeading';

export default function ExplorePage() {
  const navigate = useNavigate();
  const { season } = useSeason();
  const { filterByVibe } = useSeasonalData(season);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('All');

  const filteredStates = useMemo(() => {
    let results = filterByVibe(selectedVibe);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      results = results.filter(s => s.name.toLowerCase().includes(q));
    }
    return results;
  }, [filterByVibe, selectedVibe, searchTerm]);

  return (
    <Box sx={{ pt: { xs: 4, md: 6 }, pb: 10 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <SectionHeading
          overline="Explore"
          title={`All ${season} Destinations`}
          subtitle="Filter by vibe, search by name, and discover your next seasonal escape."
        />

        {/* Search + Filters */}
        <Box sx={{ mb: 5 }}>
          <TextField
            fullWidth
            placeholder="Search Indian states..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#f59e0b' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '28px',
                bgcolor: '#1a2332',
                color: '#f8fafc',
                fontSize: '1rem',
              },
            }}
            sx={{ mb: 3, maxWidth: 500 }}
            aria-label="Search states"
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {VIBES.map(vibe => (
              <Chip
                key={vibe}
                label={vibe}
                onClick={() => setSelectedVibe(vibe)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  borderRadius: '20px',
                  bgcolor: selectedVibe === vibe ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                  color: selectedVibe === vibe ? '#0b0f19' : '#94a3b8',
                  border: `1px solid ${selectedVibe === vibe ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                  '&:hover': { bgcolor: selectedVibe === vibe ? '#d97706' : 'rgba(255,255,255,0.08)' },
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Results Count */}
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Showing {filteredStates.length} destinations
        </Typography>

        {/* State Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredStates.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#111827', borderRadius: 4 }}>
                <Typography variant="h6" sx={{ color: '#64748b' }}>
                  No states match your current filters.
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Grid container spacing={3}>
                {filteredStates.map((state, i) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={state.name}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
                      style={{ height: '100%' }}
                    >
                      <Card
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 4,
                          height: '100%',
                          display: 'flex', flexDirection: 'column',
                          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            borderColor: 'rgba(245,158,11,0.3)',
                          },
                          '&:hover .explore-img': { transform: 'scale(1.06)' },
                        }}
                        onClick={() => navigate(`/state/${encodeURIComponent(state.name)}`)}
                      >
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                          <CardMedia
                            component="img"
                            height={190}
                            image={state.image}
                            alt={state.name}
                            className="explore-img"
                            loading="lazy"
                            sx={{ transition: 'transform 0.5s ease' }}
                          />
                          <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                            <ScoreBadge score={state.suitabilityScore} size="small" />
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(state.name); }}
                            aria-label={isFavorite(state.name) ? 'Remove from favorites' : 'Add to favorites'}
                            sx={{
                              position: 'absolute', top: 10, left: 10,
                              bgcolor: 'rgba(11,15,25,0.6)',
                              backdropFilter: 'blur(4px)',
                              color: isFavorite(state.name) ? '#f43f5e' : '#94a3b8',
                              '&:hover': { bgcolor: 'rgba(11,15,25,0.8)' },
                            }}
                          >
                            {isFavorite(state.name) ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                          </IconButton>
                          <Chip
                            label={state.vibe || 'Heritage'}
                            size="small"
                            sx={{
                              position: 'absolute', bottom: 10, left: 10,
                              bgcolor: 'rgba(11,15,25,0.8)',
                              backdropFilter: 'blur(4px)',
                              color: '#f59e0b',
                              fontWeight: 600, fontSize: '0.72rem',
                              border: '1px solid rgba(245,158,11,0.2)',
                            }}
                          />
                        </Box>

                        <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.15rem' }}>
                              {state.name}
                            </Typography>
                            <Typography variant="body2" sx={{
                              display: '-webkit-box', WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden',
                              mb: 2, fontSize: '0.85rem',
                            }}>
                              {state.weatherDesc}
                            </Typography>
                          </Box>

                          <Box sx={{ pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.4 }}>
                              <ThermostatIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                              {state.tempRange}
                            </Typography>
                            <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
                              sx={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.82rem', p: 0 }}
                            >
                              Explore
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
