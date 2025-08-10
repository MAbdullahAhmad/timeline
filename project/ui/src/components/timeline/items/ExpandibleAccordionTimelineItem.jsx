import React from 'react';
import {
  Typography, Chip, Box
} from '@mui/material';
import Timeline from '../Timeline';

export default function ExpandibleAccordionTimelineItem({
  title, category, desc, img, url, children
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6">{title}</Typography>
      <Chip label={category} size="small" />

      {category}
      {desc}

      {children && children.length > 0 && (
        <Box sx={{ mt: 2, ml: 3, pl: 3, borderLeft: '1px solid', borderColor: 'primary.main' }}>
          <Timeline items={children} />
        </Box>
      )}
    </Box>
  );
}
