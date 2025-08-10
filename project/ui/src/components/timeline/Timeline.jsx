import React from 'react';
import ExpandibleAccordionTimelineItem from './items/ExpandibleAccordionTimelineItem.jsx';
import { Box } from '@mui/material';

export default function Timeline({ items = [] }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item, idx) => (
        <ExpandibleAccordionTimelineItem key={idx} {...item} />
      ))}
    </Box>
  );
}
