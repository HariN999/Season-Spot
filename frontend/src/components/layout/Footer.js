import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Link, Divider, IconButton } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';

const QUICK_LINKS = [
  { label: 'Explore States', path: '/explore' },
  { label: 'AI Itinerary Planner', path: '/planner' },
  { label: 'Winter Destinations', path: '/explore?season=Winter' },
  { label: 'Monsoon Getaways', path: '/explore?season=Monsoon' },
];

const TOP_STATES = [
  { label: 'Goa', path: '/state/Goa' },
  { label: 'Kerala', path: '/state/Kerala' },
  { label: 'Rajasthan', path: '/state/Rajasthan' },
  { label: 'Himachal Pradesh', path: '/state/Himachal Pradesh' },
  { label: 'Tamil Nadu', path: '/state/Tamil Nadu' },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: '#070911',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 8, pb: 4 }}>
        <Grid container spacing={5}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 32, height: 32, borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ExploreIcon sx={{ color: '#fff', fontSize: 18 }} />
              </Box>
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem' }}>
                Season Spot
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 320, lineHeight: 1.7, mb: 3 }}>
              India's premier AI-powered seasonal travel and culinary guide.
              Discover the best weather windows, regional cuisine, and custom itineraries for all 28 states.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#f8fafc' } }} aria-label="GitHub">
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#f8fafc' } }} aria-label="LinkedIn">
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#f8fafc' } }} aria-label="X">
                <XIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="overline" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {QUICK_LINKS.map(link => (
                <Link
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  underline="none"
                  sx={{
                    color: '#64748b', fontSize: '0.9rem', cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#f59e0b' },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Top Destinations */}
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="overline" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
              Top Destinations
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {TOP_STATES.map(link => (
                <Link
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  underline="none"
                  sx={{
                    color: '#64748b', fontSize: '0.9rem', cursor: 'pointer',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#f59e0b' },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Tech */}
          <Grid size={{ xs: 12, md: 2 }}>
            <Typography variant="overline" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
              Built With
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.8 }}>
              React 19 &bull; Material UI<br />
              Framer Motion<br />
              Google Gemini AI<br />
              Python FastAPI<br />
              Vercel Edge
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.05)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            &copy; {new Date().getFullYear()} Season Spot. Crafted for India.
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            Designed & engineered as a portfolio project.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
