import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function ItineraryModal({ open, onClose, state, season }) {
  const [tripType, setTripType] = useState('Foodie & Cultural');
  const [budget, setBudget] = useState('Moderate');
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
        body: JSON.stringify({ state, season, tripType, budget })
      });

      if (!response.ok) {
        throw new Error('API server returned error status');
      }

      const data = await response.json();
      setItinerary(data.plan);
    } catch (err) {
      console.warn("AI Itinerary backend unavailable, using smart local fallback planner:", err);
      // Instant smart fallback plan if backend API is not deployed yet
      setItinerary({
        day1: `Arrival in ${state} (${season}). Explore local heritage sights and indulge in iconic regional dishes. Evening stroll through local spice and handicraft bazaars.`,
        day2: `Full day exploration of signature scenic attractions in ${state}. Enjoy a curated traditional lunch thali followed by sunset views at iconic lookout points.`,
        day3: `Cultural experience & local food trail. Visit historic monuments, shop for regional souvenirs, and enjoy a farewell dinner featuring famous local desserts.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: '#1a1f36', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }}>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, color: '#ff4081' }}>
        <AutoAwesomeIcon /> AI 3-Day Seasonal Itinerary for {state} ({season})
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 1, flexWrap: 'wrap' }}>
          <FormControl fullWidth size="small" sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Traveler Style</InputLabel>
            <Select value={tripType} label="Traveler Style" onChange={e => setTripType(e.target.value)} sx={{ color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}>
              <MenuItem value="Foodie & Cultural">Foodie & Cultural</MenuItem>
              <MenuItem value="Adventure & Nature">Adventure & Nature</MenuItem>
              <MenuItem value="Relaxed & Luxury">Relaxed & Luxury</MenuItem>
              <MenuItem value="Budget Explorer">Budget Explorer</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Budget Range</InputLabel>
            <Select value={budget} label="Budget Range" onChange={e => setBudget(e.target.value)} sx={{ color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}>
              <MenuItem value="Backpacker / Budget">Backpacker / Budget</MenuItem>
              <MenuItem value="Moderate">Moderate</MenuItem>
              <MenuItem value="Luxury Resort">Luxury Resort</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress color="secondary" />
            <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255,255,255,0.7)' }}>
              Gemini AI is crafting your customized 3-day itinerary for {state}...
            </Typography>
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {itinerary && (
          <Box className="itinerary-results" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, borderLeft: '4px solid #3a86ff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#60a5fa' }}>📍 Day 1: Heritage & Flavors Arrival</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(255,255,255,0.9)' }}>{itinerary.day1}</Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, borderLeft: '4px solid #2a9d8f' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2a9d8f' }}>🌄 Day 2: Scenic Highlights & Culinary Trail</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(255,255,255,0.9)' }}>{itinerary.day2}</Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, borderLeft: '4px solid #ff4081' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ff4081' }}>🛍️ Day 3: Bazaars, Culture & Sunset Farewell</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(255,255,255,0.9)' }}>{itinerary.day3}</Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Close</Button>
        <Button variant="contained" color="secondary" onClick={handleGenerate} disabled={loading} startIcon={<AutoAwesomeIcon />}>
          {itinerary ? 'Regenerate Plan' : 'Generate Itinerary'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
