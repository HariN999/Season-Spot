import React from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Chip, Button, Container } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getStateSeasonData } from '../data/seasonalData';

// Visual image mapping for Indian States
const STATE_IMAGES = {
  "Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
  "Himachal Pradesh": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
  "Kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
  "Rajasthan": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80",
  "Telangana": "https://images.unsplash.com/photo-1606210122157-797f1fdfb1d6?auto=format&fit=crop&w=600&q=80",
  "Tamil Nadu": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
  "West Bengal": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=600&q=80",
  "Uttarakhand": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
  "Sikkim": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80",
  "Karnataka": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80",
  "Jammu & Kashmir": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80"
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80";

export default function StateCardGrid({ states, selectedSeason, selectedVibe, onSelectState }) {
  const filteredStates = states.filter(state => {
    if (selectedVibe === 'All') return true;
    const data = getStateSeasonData(state, selectedSeason);
    return data.vibe === selectedVibe;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
            Explore Indian States in <span style={{ color: '#38bdf8' }}>{selectedSeason}</span>
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Showing {filteredStates.length} destinations matching your filters
          </Typography>
        </Box>
      </Box>

      {filteredStates.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 4 }}>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            No state matches the "{selectedVibe}" vibe filter for {selectedSeason}.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
            Try selecting a different vibe or switching season.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredStates.map(state => {
            const data = getStateSeasonData(state, selectedSeason);
            const coverImage = STATE_IMAGES[state] || DEFAULT_IMAGE;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={state}>
                <Card
                  onClick={() => onSelectState(state)}
                  className="official-state-card"
                  sx={{
                    borderRadius: 4,
                    bgcolor: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: '#38bdf8',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={coverImage}
                      alt={state}
                      sx={{ transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.05)' } }}
                    />
                    <Chip
                      label={`${data.suitabilityScore} / 10`}
                      size="small"
                      icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#fff !important' }} />}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        color: '#fff',
                        fontWeight: 800,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
                      }}
                    />
                    <Chip
                      label={data.vibe || 'Heritage'}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        bgcolor: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: '#38bdf8',
                        fontWeight: 700,
                        border: '1px solid rgba(56, 189, 248, 0.3)'
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
                        {state}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2 }}>
                        {data.weatherDesc}
                      </Typography>
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ThermostatIcon sx={{ fontSize: 16, color: '#ffb703' }} /> {data.tempRange}
                        </Typography>

                        <Button
                          size="small"
                          endIcon={<ArrowForwardIcon fontSize="small" />}
                          sx={{ textTransform: 'none', fontWeight: 700, color: '#38bdf8', p: 0 }}
                        >
                          Guide
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
