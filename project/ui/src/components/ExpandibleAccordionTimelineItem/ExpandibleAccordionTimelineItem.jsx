import React, { forwardRef } from 'react';
import { Box} from '@mui/material';

import DatePin from './components/DatePin';
import Topbar from './components/Topbar';
import Content from './components/Content';
import Children from './components/Children';

export default forwardRef(
  function ExpandibleAccordionTimelineItem(
    {title, note, category, categoryColor, desc, img, url, children, parents, date, shift, level, attach,},
    ref
  ) {
    return (
      <Box ref={ref} sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'primary.main' }}>

        {/* Sticky DatePin */}
        { attach && <DatePin date={date} shift={shift}/>}

        {/* Topbar */}
        <Topbar {...{parents, children, date, category, categoryColor}}/>

        {/* Content */}
        <Content {...{title, img, note, desc}}/>

        {/* Children */}
        <Children {...{children, level}}/>

      </Box>
    );
  }
);
