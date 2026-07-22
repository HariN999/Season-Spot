import React, { useState } from 'react';
import {
  Container, Box, Typography, Grid, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem, Button, Card, CardContent,
  CircularProgress, Alert, Chip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useSeason } from '../context/SeasonContext';
import SectionHeading from '../components/shared/SectionHeading';
import SeasonChip from '../components/shared/SeasonChip';

const ALL_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const TRIP_TYPES = ['Foodie & Cultural', 'Adventure & Nature', 'Relaxed & Luxury', 'Budget Explorer', 'Family Friendly', 'Solo Backpacker'];
const BUDGETS = ['Backpacker / Budget', 'Moderate', 'Luxury Resort'];
const DURATIONS = ['3 Days', '5 Days', '7 Days'];

const steps = ['Destination', 'Preferences', 'Generate'];

export default function PlannerPage() {
  const { season, setSeason, seasons } = useSeason();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedState, setSelectedState] = useState('Goa');
  const [tripType, setTripType] = useState('Foodie & Cultural');
  const [budget, setBudget] = useState('Moderate');
  const [duration, setDuration] = useState('3 Days');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setItinerary(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: selectedState, season, tripType, budget, duration }),
      });

      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setItinerary(data.plan);
    } catch (err) {
      // Smart local fallback
      const days = parseInt(duration) || 3;
      const fallbackPlan = {};
      for (let d = 1; d <= days; d++) {
        if (d === 1) {
          fallbackPlan[`day${d}`] = `Arrival in ${selectedState} during ${season}. Explore local heritage sights, sample iconic regional dishes at long-standing eateries, and take an evening stroll through spice and handicraft bazaars.`;
        } else if (d === days) {
          fallbackPlan[`day${d}`] = `Cultural immersion day in ${selectedState}. Visit historic monuments, shop for regional souvenirs and handlooms, and enjoy a farewell dinner featuring the region's most celebrated desserts.`;
        } else {
          fallbackPlan[`day${d}`] = `Day ${d} of exploring the scenic highlights, local nature trails, and hidden culinary spots of ${selectedState} during the beautiful ${season} season.`;
        }
      }
      setItinerary(fallbackPlan);
    } finally {
      setLoading(false);
    }
  };

  const dayColors = ['#38bdf8', '#10b981', '#f59e0b'];
  const dayIcons = [WbSunnyIcon, LunchDiningIcon, NightlightIcon];

  const getDayTitle = (index, total) => {
    if (index === 0) return 'Day 1: Arrival & Discovery';
    if (index === total - 1) return `Day ${total}: Culture & Farewell`;
    return `Day ${index + 1}: Scenic & Culinary Exploration`;
  };

  return (
    <Box sx={{ pt: { xs: 4, md: 6 }, pb: 10 }}>
      <Container maxWidth="md">
        <SectionHeading
          overline="AI-Powered"
          title="Plan Your Dream Trip"
          subtitle="Tell us your destination, style, and budget — let Gemini AI craft your personalized itinerary."
          align="center"
        />

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 5 }} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-completed': { color: '#f59e0b' },
                    '&.Mui-active': { color: '#f59e0b' },
                  },
                }}
              >
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <AnimatePresence mode="wait">
          {/* Step 1: Destination */}
          {activeStep === 0 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Card sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Where do you want to go?</Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>State</InputLabel>
                  <Select value={selectedState} label="State" onChange={e => setSelectedState(e.target.value)}>
                    {ALL_STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>

                <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1.5 }}>Season</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
                  {seasons.map(s => (
                    <SeasonChip key={s} season={s} selected={season === s} onClick={() => setSeason(s)} />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => setActiveStep(1)}
                    sx={{ borderRadius: '24px', px: 4 }}>
                    Next
                  </Button>
                </Box>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Preferences */}
          {activeStep === 1 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Card sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>How do you travel?</Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Traveler Style</InputLabel>
                      <Select value={tripType} label="Traveler Style" onChange={e => setTripType(e.target.value)}>
                        {TRIP_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Budget</InputLabel>
                      <Select value={budget} label="Budget" onChange={e => setBudget(e.target.value)}>
                        {BUDGETS.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Duration</InputLabel>
                      <Select value={duration} label="Duration" onChange={e => setDuration(e.target.value)}>
                        {DURATIONS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button startIcon={<ArrowBackIcon />} onClick={() => setActiveStep(0)}
                    sx={{ color: '#94a3b8' }}>
                    Back
                  </Button>
                  <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={() => { setActiveStep(2); handleGenerate(); }}
                    sx={{ borderRadius: '24px', px: 4 }}>
                    Generate Itinerary
                  </Button>
                </Box>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Results */}
          {activeStep === 2 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {/* Summary Bar */}
              <Box sx={{ mb: 4, p: 2.5, bgcolor: '#111827', borderRadius: 3, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                <Chip label={selectedState} sx={{ bgcolor: 'rgba(245,158,11,0.12)', color: '#f59e0b', fontWeight: 700 }} />
                <SeasonChip season={season} selected size="small" />
                <Chip label={tripType} size="small" sx={{ bgcolor: 'rgba(56,189,248,0.12)', color: '#38bdf8', fontWeight: 600 }} />
                <Chip label={budget} size="small" sx={{ bgcolor: 'rgba(16,185,129,0.12)', color: '#10b981', fontWeight: 600 }} />
              </Box>

              {/* Loading */}
              {loading && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CircularProgress sx={{ color: '#f59e0b', mb: 3 }} size={48} />
                  <Typography variant="h6" sx={{ mb: 1 }}>Crafting your itinerary...</Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    AI is personalizing a {duration.toLowerCase()} plan for {selectedState} during {season}.
                  </Typography>
                </Box>
              )}

              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

              {/* Results */}
              {itinerary && !loading && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {Object.entries(itinerary).map(([key, content], i) => {
                    const DayIcon = dayIcons[i % dayIcons.length];
                    return (
                      <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                        <Card sx={{
                          borderRadius: 4,
                          borderLeft: `4px solid ${dayColors[i % dayColors.length]}`,
                          '&:hover': { transform: 'translateY(-2px)' },
                          transition: 'transform 0.2s ease',
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                              <Box sx={{
                                width: 36, height: 36, borderRadius: '10px',
                                bgcolor: `${dayColors[i % dayColors.length]}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <DayIcon sx={{ color: dayColors[i % dayColors.length], fontSize: 20 }} />
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', color: dayColors[i % dayColors.length] }}>
                                {getDayTitle(i, Object.keys(itinerary).length)}
                              </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ color: '#e2e8f0', lineHeight: 1.8 }}>
                              {content}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                    <Button startIcon={<RestartAltIcon />} onClick={handleGenerate} variant="outlined"
                      sx={{ borderRadius: '24px', px: 3, borderColor: 'rgba(255,255,255,0.2)', color: '#94a3b8' }}>
                      Regenerate
                    </Button>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => { setActiveStep(0); setItinerary(null); }}
                      sx={{ borderRadius: '24px', px: 3, color: '#94a3b8' }}>
                      New Trip
                    </Button>
                  </Box>
                </Box>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
