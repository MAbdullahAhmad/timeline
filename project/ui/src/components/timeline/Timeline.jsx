import React, { useState } from 'react';
import { Box } from '@mui/material';

import ExpandibleAccordionTimelineItem from './items/ExpandibleAccordionTimelineItem/ExpandibleAccordionTimelineItem.jsx';
import ExpandButton from '../misc/ExpandButton/ExpandButton.jsx';
import TimeAside from './TimeAside/TimeAside.jsx';

export default function Timeline({ items = [], child = false, level=1 }) {
  const [openAside, setOpenAside] = useState(true);
  const root = !child;

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
          p: child ? 0 : 2,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {items.map((item, idx) => (
            <ExpandibleAccordionTimelineItem key={idx} level={level} attach={root && openAside} {...item} />
          ))}
        </Box>

        { root && <ExpandButton open={openAside} onClick={() => setOpenAside(!openAside)} />}
      </Box>

      {/* Aside panel (hidden if child=true) */}
      {root && openAside && <TimeAside open={openAside} />}
    </Box>
  );
}
