import React from 'react';
import { Box, Skeleton, Grid } from '@mui/material';

export function SkeletonCard() {
  return (
    <Box
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        bgcolor: '#1a2332',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Skeleton
        variant="rectangular"
        height={200}
        sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
        animation="wave"
      />
      <Box sx={{ p: 2.5 }}>
        <Skeleton width="60%" height={28} sx={{ bgcolor: 'rgba(255,255,255,0.08)', mb: 1 }} animation="wave" />
        <Skeleton width="90%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} animation="wave" />
        <Skeleton width="75%" height={16} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mt: 0.5 }} animation="wave" />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton width={80} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 3 }} animation="wave" />
          <Skeleton width={60} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 3 }} animation="wave" />
        </Box>
      </Box>
    </Box>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
          <SkeletonCard />
        </Grid>
      ))}
    </Grid>
  );
}

export function SkeletonHero() {
  return (
    <Box sx={{ width: '100%', height: '80vh', position: 'relative', bgcolor: '#111827' }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
        animation="wave"
      />
      <Box sx={{ position: 'absolute', bottom: '20%', left: '10%', width: '60%' }}>
        <Skeleton width="30%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.06)', mb: 2 }} animation="wave" />
        <Skeleton width="80%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.08)', mb: 1 }} animation="wave" />
        <Skeleton width="50%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.08)', mb: 3 }} animation="wave" />
        <Skeleton width="40%" height={50} sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 6 }} animation="wave" />
      </Box>
    </Box>
  );
}
