import React from 'react';
import './components';

let loaded = null;
const ThemeWrapper = ({ children }) => {
  !loaded && window.dispatchEvent(new CustomEvent('docs-loaded'));
  return <>{children}</>;
};

export default ThemeWrapper;
