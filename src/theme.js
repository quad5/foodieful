'use client';
import { Roboto } from 'next/font/google';

import { createTheme } from '@mui/material/styles';
import { deepOrange, teal } from '@mui/material/colors';


const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    text: {
      primary: "#000000", // black
    },

    primary: {
      main: deepOrange[500],
    },

    secondary: {
      main: teal[500],
      secondary: teal[200],
    },

    divider: deepOrange[700],

    background: {
      default: 'black'
    }
  },

  spacing: 8,
  typography: {
    fontFamily: roboto.style.fontFamily,
    allVariants: {
      color: 'black'
    }
  },
});

export default theme;
