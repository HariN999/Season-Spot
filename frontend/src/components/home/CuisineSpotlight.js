import React from 'react';
import { Grid, Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { motion } from 'framer-motion';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function CuisineSpotlight({ dishes }) {
  if (!dishes || dishes.length === 0) return null;

  return (
    <Grid container spacing={3}>
      {dishes.slice(0, 6).map((dish, i) => (
        <Grid item xs={12} sm={6} md={4} key={`${dish.stateName}-${dish.name}-${i}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card
              sx={{
                borderRadius: 4, height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(245,158,11,0.3)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      width: 36, height: 36, borderRadius: '10px',
                      bgcolor: 'rgba(245,158,11,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <RestaurantIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                  </Box>
                  {dish.tag && (
                    <Chip
                      label={dish.tag}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(245,158,11,0.1)',
                        color: '#f59e0b',
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        height: 22,
                      }}
                    />
                  )}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
                  {dish.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {dish.desc}
                </Typography>

                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {dish.stateName}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}
