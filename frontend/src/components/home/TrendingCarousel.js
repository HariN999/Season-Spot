import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ScoreBadge from '../shared/ScoreBadge';

export default function TrendingCarousel({ states }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  if (!states || states.length === 0) return null;

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Scroll Arrows */}
      <IconButton
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        sx={{
          position: 'absolute', left: -20, top: '50%',
          transform: 'translateY(-50%)', zIndex: 2,
          bgcolor: '#1a2332', border: '1px solid rgba(255,255,255,0.1)',
          color: '#f8fafc', display: { xs: 'none', md: 'flex' },
          '&:hover': { bgcolor: '#f59e0b', color: '#0b0f19' },
        }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      <IconButton
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        sx={{
          position: 'absolute', right: -20, top: '50%',
          transform: 'translateY(-50%)', zIndex: 2,
          bgcolor: '#1a2332', border: '1px solid rgba(255,255,255,0.1)',
          color: '#f8fafc', display: { xs: 'none', md: 'flex' },
          '&:hover': { bgcolor: '#f59e0b', color: '#0b0f19' },
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>

      {/* Scrollable Container */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex', gap: 2.5, overflowX: 'auto',
          scrollSnapType: 'x mandatory', pb: 2,
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
        }}
      >
        {states.map(state => (
          <Card
            key={state.name}
            onClick={() => navigate(`/state/${encodeURIComponent(state.name)}`)}
            sx={{
              minWidth: 280, maxWidth: 280,
              scrollSnapAlign: 'start',
              cursor: 'pointer',
              borderRadius: 4,
              flexShrink: 0,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              },
              '&:hover .carousel-img': { transform: 'scale(1.06)' },
            }}
          >
            <Box sx={{ position: 'relative', overflow: 'hidden', height: 160 }}>
              <CardMedia
                component="img"
                height={160}
                image={state.image}
                alt={state.name}
                className="carousel-img"
                loading="lazy"
                sx={{ transition: 'transform 0.5s ease' }}
              />
              <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                <ScoreBadge score={state.suitabilityScore} size="small" />
              </Box>
            </Box>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 0.3 }}>
                {state.name}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.82rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {state.weatherDesc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
