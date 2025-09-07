// RightEdgeSticky.jsx
import React from 'react';
import { Box } from '@mui/material';

export default function RightEdgeSticky({ children, top = 50, offset = 8, z = 100 }) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top,                     // sticks at viewport top - top(px)
        display: 'block',
        width: 'max-content',
        ml: 'auto',              // push to parent's right edge
        transform: `translateX(${offset}px)`, // nudge outside component
        zIndex: z
      }}
    >
      {children}
    </Box>
  );
}
