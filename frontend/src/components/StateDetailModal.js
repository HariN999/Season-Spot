import React, { useState } from 'react';
import { Dialog, DialogContent, Box, Typography, Tabs, Tab, Grid, Card, CardContent, Chip, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ExploreIcon from '@mui/icons-material/Explore';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import VerifiedIcon from '@mui/icons-material/Verified';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { getStateSeasonData } from '../data/seasonalData';
import { UNIQUE_STATE_IMAGES } from './StateCardGrid';

const DEFAULT_COVER = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80";

export default function StateDetailModal({ open, onClose, state, season, onOpenItineraryModal }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!state) return null;
  const data = getStateSeasonData(state, season);
  const coverPhoto = UNIQUE_STATE_IMAGES[state] || DEFAULT_COVER;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          bgcolor: '#0b0f19',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Full Bleed Photography Header */}
      <Box sx={{ position: 'relative', height: 200, width: '100%', overflow: 'hidden' }}>
        <Box
          component="img"
          src={coverPhoto}
          alt={state}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #0b0f19 0%, rgba(11,15,25,0.4) 60%, rgba(11,15,25,0.8) 100%)'
          }}
        />

        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#fff',
            bgcolor: 'rgba(11,15,25,0.6)',
            backdropFilter: 'blur(8px)',
            '&:hover': { bgcolor: '#0b0f19' }
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ position: 'absolute', bottom: 16, left: 24, right: 24 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="h4" className="editorial-serif" sx={{ fontWeight: 700, color: '#fff' }}>
              {state}
            </Typography>
            <Chip label={season} size="small" sx={{ bgcolor: '#f59e0b', color: '#0b0f19', fontWeight: 700 }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: '13px !important', color: '#fff !important' }} />}
              label={`Suitability: ${data.suitabilityScore} / 10`}
              size="small"
              sx={{ bgcolor: 'rgba(16, 185, 129, 0.9)', color: '#fff', fontWeight: 700 }}
            />
            <Chip
              icon={<ThermostatIcon sx={{ fontSize: '13px !important', color: '#f59e0b !important' }} />}
              label={`Temp: ${data.tempRange}`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', color: '#fff', fontWeight: 600 }}
            />
            <Chip label={`Vibe: ${data.vibe || 'Heritage'}`} size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 600 }} />
          </Box>
        </Box>
      </Box>

      {/* Tabs Bar */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.08)', px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          textColor="inherit"
          indicatorColor="warning"
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', minWidth: 100 }
          }}
        >
          <Tab icon={<ExploreIcon fontSize="small" />} iconPosition="start" label="Overview" />
          <Tab icon={<RestaurantIcon fontSize="small" />} iconPosition="start" label="Regional Gastronomy" />
          <Tab icon={<ExploreIcon fontSize="small" />} iconPosition="start" label="Must-See Spots" />
          <Tab icon={<LightbulbIcon fontSize="small" />} iconPosition="start" label="Travel Tips" />
        </Tabs>
      </Box>

      {/* Tab Contents */}
      <DialogContent sx={{ p: 3, minHeight: 300 }}>
        {/* Tab 0: Overview */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" className="editorial-serif" sx={{ fontWeight: 700, mb: 1, color: '#f59e0b' }}>
              Climate & Travel Summary
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, mb: 3 }}>
              {data.weatherDesc}
            </Typography>

            <Box sx={{ p: 3, bgcolor: 'rgba(18, 24, 38, 0.8)', borderRadius: 3, borderLeft: '3px solid #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff' }}>
                  Want a custom 3-day itinerary for {state}?
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Gemini AI will craft a personalized day-by-day plan tailored to your travel style and budget.
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => {
                  onClose();
                  onOpenItineraryModal();
                }}
                startIcon={<AutoAwesomeIcon />}
                sx={{ borderRadius: '20px', fontWeight: 700, textTransform: 'none', bgcolor: '#f59e0b', color: '#0b0f19', '&:hover': { bgcolor: '#d97706' } }}
              >
                Craft 3-Day Plan
              </Button>
            </Box>
          </Box>
        )}

        {/* Tab 1: Food */}
        {activeTab === 1 && (
          <Grid container spacing={2}>
            {data.food && data.food.map((dish, i) => (
              <Grid item xs={12} sm={6} key={`food-${i}`}>
                <Card sx={{ bgcolor: 'rgba(18, 24, 38, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    {dish.tag && <Chip label={dish.tag} size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700, mb: 1, fontSize: '0.75rem' }} />}
                    <Typography variant="h6" className="editorial-serif" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                      {dish.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                      {dish.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Tab 2: Locations */}
        {activeTab === 2 && (
          <Grid container spacing={2}>
            {data.locations && data.locations.map((loc, i) => (
              <Grid item xs={12} sm={6} key={`loc-${i}`}>
                <Card sx={{ bgcolor: 'rgba(18, 24, 38, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" className="editorial-serif" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                      {loc.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1.5, fontSize: '0.88rem' }}>
                      {loc.highlight}
                    </Typography>
                    {loc.bestTime && <Chip label={`Best Time: ${loc.bestTime}`} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', fontWeight: 600, fontSize: '0.75rem' }} />}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Tab 3: Tips */}
        {activeTab === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {data.travelTips && data.travelTips.map((tip, i) => (
              <Box key={`tip-${i}`} sx={{ p: 2, bgcolor: 'rgba(18, 24, 38, 0.7)', borderLeft: '3px solid #f59e0b', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  💡 {tip}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
