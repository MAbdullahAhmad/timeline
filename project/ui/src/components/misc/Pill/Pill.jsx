import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Pill({ label }) {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'background.default',
        height: 20,
        px: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 'bold', lineHeight: 1 }}>
        {label}
      </Typography>
    </Box>
  );
}
