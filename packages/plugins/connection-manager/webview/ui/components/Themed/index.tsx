import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import theme from './theme';


const Themed = ({ children }) => (
  <>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </>
);

export default Themed;