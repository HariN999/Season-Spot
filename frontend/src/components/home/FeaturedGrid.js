import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardMedia, CardContent, Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ScoreBadge from '../shared/ScoreBadge';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function FeaturedGrid({ states }) {
  const navigate = useNavigate();

  if (!states || states.length === 0) return null;

  return (
    <Grid container spacing={3}>
      {states.slice(0, 4).map((state, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={state.name}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            style={{ height: '100%' }}
          >
            <Card
              onClick={() => navigate(`/state/${encodeURIComponent(state.name)}`)}
              sx={{
                cursor: 'pointer',
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  borderColor: 'rgba(245,158,11,0.3)',
                },
                '&:hover .card-image': {
                  transform: 'scale(1.08)',
                },
              }}
            >
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  image={state.image}
                  alt={state.name}
                  className="card-image"
                  loading="lazy"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80"; }}
                  sx={{
                    height: 220,
                    width: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }}
                />
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <ScoreBadge score={state.suitabilityScore} size="small" />
                </Box>
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, rgba(26,35,50,0.9))' }} />
              </Box>

              <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {state.name}
                </Typography>
                <Typography variant="body2" sx={{
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  mb: 2, fontSize: '0.88rem',
                }}>
                  {state.weatherDesc}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={state.vibe || 'Heritage'}
                    size="small"
                    sx={{ bgcolor: 'rgba(245,158,11,0.12)', color: '#f59e0b', fontWeight: 600, fontSize: '0.75rem' }}
                  />
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <ThermostatIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                    {state.tempRange}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}
