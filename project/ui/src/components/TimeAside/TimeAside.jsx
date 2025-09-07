import React from 'react';
import { Box } from '@mui/material';

export default function TimeAside({ open }) {
  return (
    <Box
      sx={{
        flex: open ? '1 1 25%' : '0 0 0%',
        borderLeft: open ? '2px solid' : 'none',
        borderColor: 'primary.main',
        // transition: 'flex 0.3s ease, border 0.3s ease',
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
      }}
    >
      Timeline:<br/>
      Under development.
    </Box>
  );
}
