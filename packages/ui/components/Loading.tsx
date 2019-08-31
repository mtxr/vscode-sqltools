import React from 'react';
import { CircularProgress } from '@material-ui/core';

interface Props {
  active: boolean;
}

export default (props: Props) => (
    <div className={props.active ? 'loading' : ''}>
      <div className="fullscreen-container backdrop">
        <CircularProgress size='100px'/>
      </div>
    </div>
)
