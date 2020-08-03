import React from 'react';
import style from './style.m.scss';

const Message = ({ type, className = '', ...props }: { type?: 'error' | 'success' | 'warning' } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
  <span
  className={`${style[type]} ${className}`}
    {...props}
  />
);

export default Message;