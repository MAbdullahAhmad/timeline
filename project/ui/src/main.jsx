import React from 'react';
import ReactDOM from 'react-dom/client';

import './main.css';

import { ThemeProvider, CssBaseline } from '@mui/material';
import ESRouter from "@core/util/components/ESRouter/ESRouter.jsx";
import routes from "@/routes";
import theme from './theme';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ESRouter routes={routes} />
  </ThemeProvider>
);
