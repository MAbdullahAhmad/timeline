import React from 'react';
import { Box, Typography } from '@mui/material';
import tl_items from '@dist/timeline.json';
import Timeline from '@/components/timeline/Timeline.jsx';

export default function App() {
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
