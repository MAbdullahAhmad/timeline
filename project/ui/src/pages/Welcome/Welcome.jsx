import React from 'react';
import { Container, Typography } from '@mui/material';

export default function Welcome() {
  return (
    <Container sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Timeline
      </Typography>
      <Typography variant="body1">
        Let's keep track of progress.
      </Typography>
    </Container>
  );
}
