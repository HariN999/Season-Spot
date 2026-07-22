import React from 'react';
import { Box, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function ScoreBadge({ score, size = 'medium', variant = 'filled' }) {
  const getColor = (s) => {
    if (s >= 9) return { bg: '#059669', text: '#fff', label: 'Excellent' };
    if (s >= 8) return { bg: '#10b981', text: '#fff', label: 'Great' };
    if (s >= 7) return { bg: '#f59e0b', text: '#0b0f19', label: 'Good' };
    return { bg: '#64748b', text: '#fff', label: 'Fair' };
  };

  const config = getColor(score);
  const isSmall = size === 'small';

  if (variant === 'minimal') {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
        <VerifiedIcon sx={{ fontSize: 14, color: config.bg }} />
        <Typography variant="caption" sx={{ fontWeight: 700, color: config.bg }}>
          {score}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        bgcolor: config.bg,
        color: config.text,
        px: isSmall ? 1 : 1.5,
        py: isSmall ? 0.25 : 0.5,
        borderRadius: '20px',
        fontWeight: 800,
        fontSize: isSmall ? '0.75rem' : '0.85rem',
      }}
    >
      <VerifiedIcon sx={{ fontSize: isSmall ? 13 : 15 }} />
      {score}/10
    </Box>
  );
}
