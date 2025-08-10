import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' },
    background: { default: '#000000', paper: '#000000' },
    text: { primary: '#ffffff', secondary: '#aaaaaa' }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    button: { textTransform: 'none' }
  },
  shape: {
    borderRadius: 0
  }
});

export default theme;
