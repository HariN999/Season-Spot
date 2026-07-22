import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';

export default function Footer() {
  return (
    <Box className="official-footer">
      <Container maxWidth="lg" sx={{ pt: 8, pb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box className="brand-icon-box" sx={{ width: 34, height: 34 }}>
                <ExploreIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" className="brand-logo-text">
                Season Spot
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 360, lineHeight: 1.6 }}>
              India's premier AI-powered seasonal travel & culinary decision engine. Discover peak weather windows, top local dishes, and custom itineraries for all 28 states.
            </Typography>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.75, fontSize: '0.9rem' }}>Explore States</Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.75, fontSize: '0.9rem' }}>Seasonal Spotlights</Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.75, fontSize: '0.9rem' }}>AI Itinerary Planner</Link>
            </Box>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
              Tech Architecture
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Powered by React 19, Material UI, Google Gemini AI Engine, and Vercel Serverless Architecture (under 50ms Edge Data Dataset).
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} Season-Spot. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            Built for India Seasonal Travel & Culinary Discovery
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
