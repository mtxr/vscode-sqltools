// src/theme.js
import React from 'react';
import { components } from 'docz-theme-default';
import * as customComponents from './components';

Object.keys(customComponents).forEach(key => {
  components[key] = customComponents[key]
})

const ThemeWrapper = ({ children }) => {
  return <>{children}</>;
};

export default ThemeWrapper;
