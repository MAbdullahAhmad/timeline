import React from 'react';
import { Box, Typography } from "@mui/material";

export default function DatePart({ children }){
  return (
    <Box
      sx={{
        px: 1,
        py: 0.5,
        bgcolor: "background.default",
        color: "primary.main",
        borderRadius: 1,
        fontSize: 12,
        lineHeight: 1,
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <Typography sx={{
        fontSize: 18,
        fontWeight:'bold',
        lineHeight: '10px'
      }}>
        {children}
      </Typography>
    </Box>
  );
};