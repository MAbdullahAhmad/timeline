import React from 'react';
import { Box, Typography } from '@mui/material';

import Timeline from '@/components/Timeline/Timeline';
import { useParams } from 'react-router-dom';

import IntroAnimation from '@/animations/IntroAnimation';

export default function App() {

  const { item_id } = useParams();
  const focusId = item_id ? Number(item_id) : null;

  return (
    <>
      <IntroAnimation />
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
          }}
        >
          <Typography component="a" href="https://github.com/MAbdullahAhmad/timeline" target="_blank" sx={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            userSelect: 'none'
          }}>
            <Box
              component="img"
              src="/timeline.svg"
              alt="logo"
              sx={{ width: 28, height: 28 }}
            />
            <Typography variant="h4" color="primary.main" fontWeight="bold" m="0">
              Timeline
            </Typography>
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
    </>
  );
}
