import React from 'react';

interface Props {
  active: boolean;
}

export default (props: Props) => (
    <div className={props.active ? 'loading' : ''}>
      <div className="fullscreen-container backdrop">
        <div className="spinner" />
      </div>
    </div>
)
