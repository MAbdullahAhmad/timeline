import React from 'react';
import { Box, Typography } from '@mui/material';
import tl_items from '@dist/timeline.json';
import TimelineView from '@/components/timeline/Timeline.jsx';

export default function Timeline() {
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
        id="Timeline-header"
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
        id="Timeline-body"
        sx={{
          flex: '1 1 0',
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'stretch',
        }}
      >
        <TimelineView items={tl_items} />
      </Box>
    </Box>
  );
}
