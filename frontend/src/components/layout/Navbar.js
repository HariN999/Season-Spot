import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Typography, Button, Container,
  IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExploreIcon from '@mui/icons-material/Explore';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SeasonChip from '../shared/SeasonChip';
import { useSeason } from '../../context/SeasonContext';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Explore', path: '/explore' },
  { label: 'AI Planner', path: '/planner' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { season, setSeason, seasons } = useSeason();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(11, 15, 25, 0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 2, py: 0.5 }}>
            {/* Brand */}
            <Box
              onClick={() => navigate('/')}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                cursor: 'pointer', mr: 4, flexShrink: 0,
              }}
              role="link"
              aria-label="Season Spot Home"
            >
              <Box
                sx={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(245,158,11,0.25)',
                }}
              >
                <ExploreIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700, fontSize: '1.15rem',
                    lineHeight: 1.1, color: '#fff',
                  }}
                >
                  Season Spot
                </Typography>
                <Typography sx={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  India Travel Guide
                </Typography>
              </Box>
            </Box>

            {/* Desktop Nav Links */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5, mr: 'auto' }}>
                {NAV_LINKS.map(link => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Button
                      key={link.path}
                      onClick={() => navigate(link.path)}
                      sx={{
                        color: isActive ? '#f59e0b' : '#94a3b8',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.9rem',
                        px: 2,
                        borderRadius: 2,
                        '&:hover': { color: '#f8fafc', bgcolor: 'rgba(255,255,255,0.04)' },
                      }}
                    >
                      {link.label}
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* Season Switcher */}
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex', gap: 0.5, p: 0.5,
                  borderRadius: '28px',
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                role="radiogroup"
                aria-label="Season selector"
              >
                {seasons.map(s => (
                  <SeasonChip
                    key={s}
                    season={s}
                    selected={season === s}
                    onClick={() => setSeason(s)}
                    size="small"
                  />
                ))}
              </Box>
            )}

            {/* AI Planner CTA */}
            {!isMobile && (
              <Button
                onClick={() => navigate('/planner')}
                startIcon={<AutoAwesomeIcon />}
                sx={{
                  ml: 1, borderRadius: '24px', px: 2.5,
                  bgcolor: 'rgba(245,158,11,0.1)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245,158,11,0.25)',
                  fontWeight: 700, fontSize: '0.85rem',
                  '&:hover': {
                    bgcolor: '#f59e0b', color: '#0b0f19',
                    boxShadow: '0 4px 20px rgba(245,158,11,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                AI Planner
              </Button>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ ml: 'auto', color: '#f8fafc' }}
                aria-label="Open navigation menu"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300, bgcolor: '#111827',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#94a3b8' }} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ px: 2 }}>
          {NAV_LINKS.map(link => (
            <ListItem
              key={link.path}
              onClick={() => { navigate(link.path); setDrawerOpen(false); }}
              sx={{
                borderRadius: 2, mb: 0.5, cursor: 'pointer',
                bgcolor: location.pathname === link.path ? 'rgba(245,158,11,0.1)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
              }}
            >
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontWeight: location.pathname === link.path ? 700 : 500,
                  color: location.pathname === link.path ? '#f59e0b' : '#f8fafc',
                }}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ px: 3, mt: 2 }}>
          <Typography variant="overline" sx={{ color: '#64748b', display: 'block', mb: 1 }}>Season</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {seasons.map(s => (
              <SeasonChip key={s} season={s} selected={season === s} onClick={() => setSeason(s)} size="small" />
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
