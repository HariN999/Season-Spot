import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function PlannerCTA() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: 6,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #1a2332 0%, #0b0f19 100%)',
          border: '1px solid rgba(245,158,11,0.15)',
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 6 },
          textAlign: 'center',
        }}
      >
        {/* Decorative glow */}
        <Box
          sx={{
            position: 'absolute', top: '-50%', left: '50%',
            transform: 'translateX(-50%)',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: '16px',
              bgcolor: 'rgba(245,158,11,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 3,
            }}
          >
            <AutoAwesomeIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Your perfect trip, <br />
            <Box component="span" sx={{ color: '#f59e0b', fontStyle: 'italic' }}>planned by AI.</Box>
          </Typography>

          <Typography variant="body1" sx={{ color: '#94a3b8', maxWidth: 500, mx: 'auto', mb: 4, fontSize: '1.05rem' }}>
            Tell us your style, budget, and destination. Gemini AI crafts
            a personalized day-by-day itinerary with restaurants, attractions, and packing advice.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/planner')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: '28px', px: 5, py: 1.5,
              fontSize: '1rem', fontWeight: 700,
            }}
          >
            Start Planning
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}
