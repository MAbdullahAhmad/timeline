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
        lineHeight: 1,
        userSelect: "none",
        whiteSpace: "nowrap",
        // paddingBottom: '39px',
        // marginBottom: '-39px'
      }}
    >
      <Typography sx={{
        fontSize: 22,
        fontWeight:'bold',
        lineHeight: '10px'
      }}>
        {children}
      </Typography>
    </Box>
  );
};