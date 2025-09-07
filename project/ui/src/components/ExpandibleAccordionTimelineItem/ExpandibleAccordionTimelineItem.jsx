import React from 'react';

import { Box} from '@mui/material';
import AttachCircle from '@/components/misc/AttachCircle/AttachCircle';

import Children from './components/Children';
import Content from './components/Content';
import Topbar from './components/Topbar';


export default function ExpandibleAccordionTimelineItem({
  title, note, category, categoryColor, desc, img, url, children, parents, date, level, attach
}) {

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'primary.main' }}>

      {/* Sticky Attachment */}
      {attach && <AttachCircle/>}

      {/* Topbar */}
      <Topbar {...{parents, children, date, category, categoryColor}}/>

      {/* Content */}
      <Content {...{title, img, note, desc}}/>

      {/* Children */}
      <Children {...{children, level}}/>

    </Box>
  );
}
