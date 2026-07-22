import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Card, CardContent, Chip, Button, IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ExploreIcon from '@mui/icons-material/Explore';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useSeason } from '../context/SeasonContext';
import { useSeasonalData } from '../hooks/useSeasonalData';
import { useFavorites, useRecentlyViewed } from '../hooks/useLocalStorage';
import ScoreBadge from '../components/shared/ScoreBadge';
import SeasonChip from '../components/shared/SeasonChip';
import SectionHeading from '../components/shared/SectionHeading';

export default function StateDetailPage() {
  const { stateName } = useParams();
  const navigate = useNavigate();
  const { season } = useSeason();
  const { getStateData, getSeasonComparison, getNearbyStates } = useSeasonalData(season);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addViewed } = useRecentlyViewed();

  const decodedName = decodeURIComponent(stateName);
  const state = getStateData(decodedName);
  const seasonComparison = getSeasonComparison(decodedName);
  const nearbyStates = getNearbyStates(decodedName);

  useEffect(() => {
    if (decodedName) addViewed(decodedName);
    window.scrollTo(0, 0);
  }, [decodedName, addViewed]);

  if (!state) {
    return (
      <Container maxWidth="lg" sx={{ py: 20, textAlign: 'center' }}>
        <Typography variant="h4">State not found</Typography>
        <Button onClick={() => navigate('/explore')} sx={{ mt: 2 }}>Back to Explore</Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* Parallax Hero */}
      <Box sx={{ position: 'relative', height: { xs: '50vh', md: '65vh' }, overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${state.image})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            backgroundAttachment: { md: 'fixed' },
            '&::after': {
              content: '""', position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(11,15,25,0.2) 0%, rgba(11,15,25,0.7) 60%, #0b0f19 100%)',
            },
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 5 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/explore')}
              sx={{ color: '#94a3b8', mb: 2, '&:hover': { color: '#f8fafc' } }}>
              All Destinations
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
              <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
                {state.name}
              </Typography>
              <IconButton onClick={() => toggleFavorite(state.name)}
                aria-label={isFavorite(state.name) ? 'Remove from favorites' : 'Add to favorites'}
                sx={{ color: isFavorite(state.name) ? '#f43f5e' : '#94a3b8' }}>
                {isFavorite(state.name) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            {/* Quick Stats */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <ScoreBadge score={state.suitabilityScore} />
              <Chip icon={<ThermostatIcon sx={{ color: '#f59e0b !important', fontSize: '16px !important' }} />}
                label={state.tempRange} size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#f8fafc', fontWeight: 600, backdropFilter: 'blur(4px)' }} />
              <Chip label={state.vibe || 'Heritage'} size="small"
                sx={{ bgcolor: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 600 }} />
              <SeasonChip season={season} selected size="small" />
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        {/* Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <Typography variant="body1" sx={{ fontSize: '1.15rem', lineHeight: 1.8, maxWidth: 700, mb: 6, color: '#94a3b8' }}>
            {state.weatherDesc}
          </Typography>
        </motion.div>

        {/* Season Comparison */}
        <Box sx={{ mb: 8 }}>
          <SectionHeading overline="Seasonal Comparison" title={`${state.name} Across Seasons`} />
          <Grid container spacing={2}>
            {seasonComparison.map(s => (
              <Grid item xs={6} md={3} key={s.season}>
                <Card sx={{
                  borderRadius: 3, p: 2.5,
                  border: s.season === season ? '1px solid #f59e0b' : undefined,
                  bgcolor: s.season === season ? 'rgba(245,158,11,0.06)' : undefined,
                }}>
                  <SeasonChip season={s.season} selected={s.season === season} size="small" />
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 1.5, color: s.season === season ? '#f59e0b' : '#f8fafc' }}>
                    {s.suitabilityScore}/10
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>{s.tempRange}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Regional Cuisine */}
        {state.food && state.food.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <SectionHeading overline="Regional Gastronomy" title="Signature Seasonal Dishes"
              subtitle={`Authentic culinary experiences in ${state.name} during ${season}.`} />
            <Grid container spacing={3}>
              {state.food.map((dish, i) => (
                <Grid item xs={12} sm={6} md={4} key={`${dish.name}-${i}`}>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <Card sx={{ borderRadius: 4, height: '100%', '&:hover': { borderColor: 'rgba(245,158,11,0.3)', transform: 'translateY(-3px)' }, transition: 'all 0.3s ease' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <RestaurantIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                          {dish.tag && <Chip label={dish.tag} size="small" sx={{ bgcolor: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 600, fontSize: '0.72rem', height: 22 }} />}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.05rem' }}>{dish.name}</Typography>
                        <Typography variant="body2">{dish.desc}</Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Destinations */}
        {state.locations && state.locations.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <SectionHeading overline="Must-Visit" title="Top Destinations"
              subtitle={`Best places to explore in ${state.name} during ${season}.`} />
            <Grid container spacing={3}>
              {state.locations.map((loc, i) => (
                <Grid item xs={12} sm={6} md={4} key={`${loc.name}-${i}`}>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <Card sx={{ borderRadius: 4, height: '100%', '&:hover': { borderColor: 'rgba(56,189,248,0.3)', transform: 'translateY(-3px)' }, transition: 'all 0.3s ease' }}>
                      <CardContent sx={{ p: 3 }}>
                        <ExploreIcon sx={{ color: '#38bdf8', mb: 1.5 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.05rem' }}>{loc.name}</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>{loc.highlight}</Typography>
                        {loc.bestTime && <Chip label={`Best: ${loc.bestTime}`} size="small" sx={{ bgcolor: 'rgba(56,189,248,0.1)', color: '#38bdf8', fontWeight: 600, fontSize: '0.72rem' }} />}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Travel Tips */}
        {state.travelTips && state.travelTips.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <SectionHeading overline="Insider Tips" title="Travel Essentials" />
            <Grid container spacing={2}>
              {state.travelTips.map((tip, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Box sx={{ p: 2.5, bgcolor: '#111827', borderRadius: 3, borderLeft: '3px solid #f59e0b', height: '100%' }}>
                    <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                      <LightbulbIcon sx={{ fontSize: 16, color: '#f59e0b', mr: 1, verticalAlign: 'text-bottom' }} />
                      {tip}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* AI Planner CTA */}
        <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: '#111827', borderRadius: 5, border: '1px solid rgba(245,158,11,0.12)', textAlign: 'center' }}>
          <AutoAwesomeIcon sx={{ color: '#f59e0b', fontSize: 32, mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1 }}>
            Plan your <span style={{ color: '#f59e0b', fontStyle: 'italic' }}>{state.name}</span> trip
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            Let AI craft a personalized day-by-day itinerary for your {season} visit.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/planner')} startIcon={<AutoAwesomeIcon />}
            sx={{ borderRadius: '24px', px: 4 }}>
            Generate Itinerary
          </Button>
        </Box>

        {/* Nearby States */}
        {nearbyStates.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <SectionHeading overline="Similar Vibes" title="Nearby Destinations" />
            <Grid container spacing={3}>
              {nearbyStates.map(ns => (
                <Grid item xs={12} sm={4} key={ns.name}>
                  <Card onClick={() => navigate(`/state/${encodeURIComponent(ns.name)}`)}
                    sx={{ cursor: 'pointer', borderRadius: 4, '&:hover': { transform: 'translateY(-4px)', borderColor: 'rgba(245,158,11,0.3)' }, transition: 'all 0.3s ease' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{ns.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <ScoreBadge score={ns.suitabilityScore} size="small" />
                        <Typography variant="caption" sx={{ color: '#64748b' }}>{ns.tempRange}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
