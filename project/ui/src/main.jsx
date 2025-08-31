import React from 'react';
import ReactDOM from 'react-dom/client';

import './main.css';
import App from './App';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
