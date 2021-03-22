import React from 'react';
import { Grid } from '@devexpress/dx-react-grid-material-ui';
import style from './style.m.scss';

const GridRoot: typeof Grid.Root = ({ className = '', ...props }) => (
  <Grid.Root
    className={`${style.root} ${className}`}
    {...props}
  />
);
export default GridRoot;