import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSeason } from '../../context/SeasonContext';
import { SEASON_HERO_IMAGES } from '../../data/stateImages';

export default function HeroSection() {
  const navigate = useNavigate();
  const { season } = useSeason();
  const heroImage = SEASON_HERO_IMAGES[season];

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.8s ease',
          '&::after': {
            content: '""',
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(11,15,25,0.3) 0%, rgba(11,15,25,0.6) 50%, #0b0f19 100%)',
          },
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pb: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#f59e0b', mb: 2, display: 'block', letterSpacing: '0.2em' }}
          >
            AI-Powered Seasonal Guide
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              lineHeight: 1.1,
              maxWidth: 700,
              mb: 3,
            }}
          >
            Discover India <br />
            <Box component="span" sx={{ color: '#f59e0b', fontStyle: 'italic' }}>
              at its finest.
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: '#94a3b8', maxWidth: 520, mb: 4, fontSize: '1.1rem' }}
          >
            Explore the best weather windows, regional cuisine, and curated travel
            experiences across 28 states and every season.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/explore')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: '28px', px: 4, py: 1.5,
                fontSize: '1rem', fontWeight: 700,
              }}
            >
              Explore Destinations
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/planner')}
              sx={{
                borderRadius: '28px', px: 4, py: 1.5,
                fontSize: '1rem', fontWeight: 700,
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#f8fafc',
                '&:hover': {
                  borderColor: '#f59e0b',
                  bgcolor: 'rgba(245,158,11,0.08)',
                },
              }}
            >
              Plan a Trip
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
