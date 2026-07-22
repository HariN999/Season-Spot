import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Tabs, Tab, Grid, Card, CardContent, Chip, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ExploreIcon from '@mui/icons-material/Explore';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import VerifiedIcon from '@mui/icons-material/Verified';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { getStateSeasonData } from '../data/seasonalData';

export default function StateDetailModal({ open, onClose, state, season, onOpenItineraryModal }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!state) return null;
  const data = getStateSeasonData(state, season);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          bgcolor: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
        }
      }}
    >
      {/* Dialog Header */}
      <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
              {state}
            </Typography>
            <Chip label={season} color="primary" size="small" sx={{ fontWeight: 700 }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
            <Chip
              icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#fff !important' }} />}
              label={`Suitability: ${data.suitabilityScore} / 10`}
              size="small"
              sx={{ bgcolor: '#059669', color: '#fff', fontWeight: 800 }}
            />
            <Chip
              icon={<ThermostatIcon sx={{ fontSize: '14px !important', color: '#ffb703 !important' }} />}
              label={`Temp: ${data.tempRange}`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 600 }}
            />
            <Chip label={`Vibe: ${data.vibe || 'Heritage'}`} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }} />
          </Box>
        </Box>

        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Tabs Bar */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.95rem', minWidth: 100 }
          }}
        >
          <Tab icon={<ExploreIcon fontSize="small" />} iconPosition="start" label="Overview" />
          <Tab icon={<RestaurantIcon fontSize="small" />} iconPosition="start" label="Culinary Specialities" />
          <Tab icon={<ExploreIcon fontSize="small" />} iconPosition="start" label="Top Destinations" />
          <Tab icon={<LightbulbIcon fontSize="small" />} iconPosition="start" label="Packing & Tips" />
        </Tabs>
      </Box>

      {/* Tab Contents */}
      <DialogContent sx={{ p: 3, minHeight: 320 }}>
        {/* Tab 0: Overview */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#38bdf8' }}>
              Climate & Seasonal Summary
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, mb: 3 }}>
              {data.weatherDesc}
            </Typography>

            <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 3, borderLeft: '4px solid #ec4899', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff' }}>
                  Want a customized 3-day itinerary for {state}?
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Gemini AI will generate a day-by-day plan tailored to your budget and travel style.
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  onClose();
                  onOpenItineraryModal();
                }}
                startIcon={<AutoAwesomeIcon />}
                sx={{ borderRadius: '20px', fontWeight: 700, textTransform: 'none' }}
              >
                Generate 3-Day Plan
              </Button>
            </Box>
          </Box>
        )}

        {/* Tab 1: Food */}
        {activeTab === 1 && (
          <Grid container spacing={2}>
            {data.food && data.food.map((dish, i) => (
              <Grid item xs={12} sm={6} key={`food-${i}`}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    {dish.tag && <Chip label={dish.tag} size="small" sx={{ bgcolor: 'rgba(244, 114, 182, 0.2)', color: '#f472b6', fontWeight: 700, mb: 1 }} />}
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                      {dish.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
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
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                      {loc.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mb: 1.5 }}>
                      {loc.highlight}
                    </Typography>
                    {loc.bestTime && <Chip label={`Best Time: ${loc.bestTime}`} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }} />}
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
              <Box key={`tip-${i}`} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.04)', borderLeft: '3px solid #ffb703', borderRadius: 2 }}>
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
