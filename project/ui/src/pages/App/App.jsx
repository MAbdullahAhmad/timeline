import React from 'react';
import { Box, Typography } from '@mui/material';

// import map_date_shift from '@/util/functions/map_date_shift';
// import timeline_items from '@dist/timeline.json';

import Timeline from '@/components/Timeline/Timeline';
import { useParams } from 'react-router-dom';

export default function App() {
  // const tl_items = timeline_items.map(map_date_shift);

  const { item_id } = useParams();
  const focusId = item_id ? Number(item_id) : null;

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
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          component="img"
          src="/timeline.svg"
          alt="logo"
          sx={{ width: 28, height: 28 }}
        />
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
        {/* <Timeline items={tl_items} /> */}
        <Timeline focusId={focusId} />
      </Box>
    </Box>
  );
}
