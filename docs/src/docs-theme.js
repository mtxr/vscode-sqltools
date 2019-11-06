import React from 'react';
import './components';

let loaded = null;
const checkLocationHash = () => {
  if (loaded) return;
  loaded = true;
  const prevOnLoad = window.onload;
  window.onload = (...args) => {
    prevOnLoad && prevOnLoad(...args);
    setTimeout(() => {
      try {
        if (!window.location.hash) return;
        const el = document.getElementById(window.location.hash.substr(1));
        el.scrollIntoView({
          behavior: 'smooth',
        });
      } catch (error) {}
    }, 1000);
  }
}

const ThemeWrapper = ({ children }) => {
  checkLocationHash();
  return <>{children}</>;
};

export default ThemeWrapper;
