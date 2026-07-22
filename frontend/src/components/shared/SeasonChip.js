import React from 'react';
import { Chip } from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

const SEASON_CONFIG = {
  Winter:  { icon: AcUnitIcon,       color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  Spring:  { icon: LocalFloristIcon, color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  Summer:  { icon: WbSunnyIcon,      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  Monsoon: { icon: ThunderstormIcon,  color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
};

export default function SeasonChip({ season, selected = false, onClick, size = 'medium' }) {
  const config = SEASON_CONFIG[season] || SEASON_CONFIG.Winter;
  const Icon = config.icon;

  return (
    <Chip
      icon={<Icon sx={{ color: `${selected ? '#0b0f19' : config.color} !important`, fontSize: size === 'small' ? 16 : 18 }} />}
      label={season}
      onClick={onClick}
      size={size}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        fontWeight: 700,
        fontSize: size === 'small' ? '0.8rem' : '0.9rem',
        borderRadius: '24px',
        px: size === 'small' ? 0.5 : 1.5,
        py: size === 'small' ? 0 : 0.5,
        bgcolor: selected ? config.color : config.bg,
        color: selected ? '#0b0f19' : config.color,
        border: `1px solid ${selected ? config.color : 'transparent'}`,
        transition: 'all 0.25s ease',
        '&:hover': onClick ? {
          bgcolor: selected ? config.color : `${config.color}33`,
          transform: 'translateY(-1px)',
        } : {},
      }}
    />
  );
}

export { SEASON_CONFIG };
