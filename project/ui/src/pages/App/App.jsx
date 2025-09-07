import React from 'react';
import { Box, Typography } from '@mui/material';
import Timeline from '@/components/Timeline/Timeline';

import map_date_shift from '@/util/functions/map_date_shift';
import timeline_items from '@dist/timeline.json';

export default function App() {
  const tl_items = timeline_items.map(map_date_shift);
  
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ------ */}
      {/* Header */}
      {/* ------ */}
      <Box
        component="header"
        sx={{
          flex: '0 0 auto',
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          p: 1
        }}
      >
        <Typography variant="h4" color="primary.main" fontWeight="bold" m="0">
          Timeline
        </Typography>
      </Box>

      {/* ------ */}
      {/*  Main  */}
      {/* ------ */}
      <Box
        component="main"
        sx={{
          flex: '1 1 0',
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'stretch',
        }}
      >
        <Timeline items={tl_items} />
      </Box>
    </Box>
  );
}
