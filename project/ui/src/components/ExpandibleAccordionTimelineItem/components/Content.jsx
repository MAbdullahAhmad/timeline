import React from 'react';

import {
  Typography, Box
} from '@mui/material';

export default function Content({
  title, img, note, desc
}){
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {/* Left */}
      <Box sx={{ flex: img ? '0 0 60%' : '1 1 100%' }}>
        {/* Title */}
        {title && (
          <Typography sx={{
            mt:2,
            fontWeight:"bold",
            fontSize:30,
          }}>{title}</Typography>
        )}

        {/* Note */}
        {note && (
          <Typography sx={{
            mt:3,
            pb: 1,
            fontSize:20,
          }}>{note}</Typography>
        )}

        {/* Description */}
        {desc && desc.split("\n").map( (d, idx) => (
          <Typography key={idx} varient="p" sx={{
            mt:2,
            fontSize:15,
          }}>{d}</Typography>
        ))}
      </Box>

      {/* Right: image (40%) */}
      {img && (
        <Box sx={{ flex: '0 0 40%', display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            component="img"
            src={img}
            alt={title || 'image'}
            sx={{ width: '100%', height: 'auto', objectFit: 'contain', m: 1 }}
          />
        </Box>
      )}
    </Box>
  )
}