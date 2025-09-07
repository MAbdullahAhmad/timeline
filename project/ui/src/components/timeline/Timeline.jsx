import React, { useState } from 'react';
import { Box } from '@mui/material';

import ExpandibleAccordionTimelineItem from './items/ExpandibleAccordionTimelineItem.jsx';

export default function Timeline({ items = [], child = false, level=1 }) {
  const [openAside, setOpenAside] = useState(true);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        overflow: 'scroll',
        flex: '1 1 0',
      }}
    >
      {/* Main content (75% or 100% if child=true or aside closed) */}
      <Box
        sx={{
          flex: child ? '1 1 100%' : openAside ? '1 1 75%' : '1 1 100%',
          alignItems: 'stretch',
          // transition: 'flex 0.3s ease',
          p: child ? 0 : 2,
          position: 'relative',
          // overflowY: 'scroll',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {items.map((item, idx) => (
            <ExpandibleAccordionTimelineItem key={idx} level={level} attach={!child && openAside} {...item} />
          ))}
        </Box>

        { !child && (
          <Box
            onClick={() => setOpenAside(!openAside)}
            sx={{
              position: 'fixed',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              width: 10,
              height: 50,
              bgcolor: 'primary.main',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': { opacity: 0.8 },
              zIndex: 2
            }}
          >
            <Box
              component="span"
              sx={{
                width: 0,
                height: 0,
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                borderLeft: '6px solid black', // caret color (black bg contrast)
                transform: openAside ? 'rotate(0deg)' : 'rotate(180deg)',
                // transition: 'transform 0.3s ease'
              }}
            />
          </Box>
        )}
      </Box>

      {/* Aside panel (hidden if child=true) */}
      {!child && openAside && (
        <Box
          sx={{
            flex: openAside ? '1 1 25%' : '0 0 0%',
            borderLeft: openAside ? '2px solid' : 'none',
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
      )}
    </Box>
  );
}
