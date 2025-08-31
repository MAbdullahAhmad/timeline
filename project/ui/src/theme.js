import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' }, // white
    background: { default: '#000000', paper: '#000000' }, // black
    border: { main: '#555555' }, // custom border color
    text: { primary: '#ffffff', secondary: '#aaaaaa', light: '#dddddd' }
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
