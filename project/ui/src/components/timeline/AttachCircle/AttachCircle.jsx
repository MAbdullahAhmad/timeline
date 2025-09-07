import React from 'react';
import { Box } from '@mui/material';

import Attach from '@/components/misc/Attach/Attach';

export default function AttachCircle({ children }) {
  return (
    <Attach top={50} offset={50}>
      <Box sx={{
        border: '1px solid',
        borderColor: 'primary.main',
        bgcolor: 'background.default',
        px: 1, py: 0.25,
        fontSize: 10, fontWeight: 'bold'
      }}>
        o
      </Box>
    </Attach>
  );
}
