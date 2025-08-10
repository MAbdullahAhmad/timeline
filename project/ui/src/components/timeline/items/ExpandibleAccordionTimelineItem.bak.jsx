import React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails,
  Typography, Chip, Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Timeline from '../Timeline';

export default function ExpandibleAccordionTimelineItem({
  title, category, desc, img, url, children
}) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">{title}</Typography>
          <Chip label={category} size="small" />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {desc && <Typography variant="body2">{desc}</Typography>}
        {img && <Box component="img" src={img} alt={title} sx={{ maxWidth: '100%', mt: 1 }} />}
        {url && <Typography variant="body2" sx={{ mt: 1 }}>
          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        </Typography>}
        {children && children.length > 0 && (
          <Box sx={{ mt: 2, ml: 3 }}>
            <Timeline items={children} />
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
