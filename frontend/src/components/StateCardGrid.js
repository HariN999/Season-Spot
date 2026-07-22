import React from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Chip, Button, Container } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getStateSeasonData } from '../data/seasonalData';

// 28 Unique, Curated High-Res Photography URLs for every single Indian State
export const UNIQUE_STATE_IMAGES = {
  "Andhra Pradesh": "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=600&q=80",
  "Arunachal Pradesh": "https://images.unsplash.com/photo-1622308644420-b20142dc993a?auto=format&fit=crop&w=600&q=80",
  "Assam": "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80",
  "Bihar": "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=600&q=80",
  "Chattisgarh": "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80",
  "Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
  "Gujarat": "https://images.unsplash.com/photo-1609946782782-95e26ec03b9b?auto=format&fit=crop&w=600&q=80",
  "Haryana": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80",
  "Himachal Pradesh": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
  "Jharkhand": "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80",
  "Karnataka": "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80",
  "Kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
  "Madhya Pradesh": "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80",
  "Maharashtra": "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=600&q=80",
  "Manipur": "https://images.unsplash.com/photo-1618245318763-a15156d6b23c?auto=format&fit=crop&w=600&q=80",
  "Meghalaya": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
  "Mizoram": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
  "Nagaland": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
  "Odisha": "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=600&q=80",
  "Punjab": "https://images.unsplash.com/photo-1588096344356-7880d738f657?auto=format&fit=crop&w=600&q=80",
  "Rajasthan": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80",
  "Sikkim": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80",
  "Tamil Nadu": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
  "Telangana": "https://images.unsplash.com/photo-1606210122157-797f1fdfb1d6?auto=format&fit=crop&w=600&q=80",
  "Tripura": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
  "Uttar Pradesh": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
  "Uttarakhand": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
  "West Bengal": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=600&q=80"
};

const DEFAULT_COVER = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80";

export default function StateCardGrid({ states, selectedSeason, selectedVibe, onSelectState }) {
  const filteredStates = states.filter(state => {
    if (selectedVibe === 'All') return true;
    const data = getStateSeasonData(state, selectedSeason);
    return data.vibe === selectedVibe;
  });

  return (
    <Container maxWidth="xl" sx={{ pb: 8 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" className="editorial-serif" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
            Destinations in <span style={{ color: '#f59e0b', fontStyle: 'italic' }}>{selectedSeason}</span>
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Showing {filteredStates.length} curated Indian state guides
          </Typography>
        </Box>
      </Box>

      {filteredStates.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.06)' }}>
          <Typography variant="h6" sx={{ color: '#94a3b8' }}>
            No destination matches the "{selectedVibe}" filter for {selectedSeason}.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredStates.map(state => {
            const data = getStateSeasonData(state, selectedSeason);
            const coverImage = UNIQUE_STATE_IMAGES[state] || DEFAULT_COVER;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={state}>
                <Card
                  onClick={() => onSelectState(state)}
                  className="editorial-state-card"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={coverImage}
                      alt={state}
                      sx={{ transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.06)' } }}
                    />
                    <Chip
                      label={`${data.suitabilityScore} / 10`}
                      size="small"
                      icon={<VerifiedIcon sx={{ fontSize: '13px !important', color: '#fff !important' }} />}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'rgba(16, 185, 129, 0.95)',
                        backdropFilter: 'blur(4px)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.78rem'
                      }}
                    />
                    <Chip
                      label={data.vibe || 'Heritage'}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        bgcolor: 'rgba(11, 15, 25, 0.85)',
                        backdropFilter: 'blur(8px)',
                        color: '#f59e0b',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        border: '1px solid rgba(245, 158, 11, 0.25)'
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" className="state-card-title" sx={{ mb: 0.5 }}>
                        {state}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2, lineHeight: 1.5 }}>
                        {data.weatherDesc}
                      </Typography>
                    </Box>

                    <Box sx={{ pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                        <ThermostatIcon sx={{ fontSize: 15, color: '#f59e0b' }} /> {data.tempRange}
                      </Typography>

                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon fontSize="small" />}
                        sx={{ textTransform: 'none', fontWeight: 700, color: '#f59e0b', p: 0, fontSize: '0.85rem' }}
                      >
                        Explore
                      </Button>
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
