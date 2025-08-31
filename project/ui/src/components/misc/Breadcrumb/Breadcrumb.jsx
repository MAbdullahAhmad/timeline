import React from 'react';
import { Box } from '@mui/material';
import Pill from '../Pill/Pill.jsx';

export default function ParentsBreadcrumb({ parents = {} }) {
  const entries = Object.entries(parents);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {entries.map(([id, name], i) => (
        <React.Fragment key={id}>
          <Pill label={name} />
          {i < entries.length - 1 && (
            <Box
              sx={{
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderLeft: '6px solid',
                borderLeftColor: 'primary.main' // white caret
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
}
