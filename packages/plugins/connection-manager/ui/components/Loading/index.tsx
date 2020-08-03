import React from 'react';
import { CircularProgress } from '@material-ui/core';
import style from './style.m.scss';

export default () => (
    <div className={style.loading}>
      <div>
        <CircularProgress size='100px'/>
      </div>
    </div>
);
