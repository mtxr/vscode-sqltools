import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import theme from './theme';
import ErrorBoundary from '../ErrorBoundary';

const Themed = ({ children }) => (
  <ThemeProvider theme={theme}>
    <ErrorBoundary>{children}</ErrorBoundary>
  </ThemeProvider>
);

export default Themed;
