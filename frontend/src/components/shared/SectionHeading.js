import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function SectionHeading({ overline, title, subtitle, align = 'left', light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ mb: 4, textAlign: align }}>
        {overline && (
          <Typography
            variant="overline"
            sx={{
              color: '#f59e0b',
              display: 'block',
              mb: 1,
              fontWeight: 700,
              letterSpacing: '0.15em',
            }}
          >
            {overline}
          </Typography>
        )}
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 700,
            color: light ? '#fff' : '#f8fafc',
            mb: subtitle ? 1.5 : 0,
            fontSize: { xs: '1.8rem', md: '2.4rem' },
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              color: '#94a3b8',
              maxWidth: align === 'center' ? 600 : 'none',
              mx: align === 'center' ? 'auto' : 0,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
}
