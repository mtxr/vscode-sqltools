import React from 'react';
import styles from './style.m.scss';

interface StyledProps {
  fg?: string;
  bg?: string;
  float?: 'right' | 'left',
  a?: boolean;
}

const Button = ({
  className = '',
  style = {},
  fg,
  float,
  bg,
  a: useAnchor,
  ...props
}: StyledProps & React.AnchorHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>) => {
  const composedProps = {
    className: `${styles.button} ${className}`,
    style: {
      color: fg,
      background: bg,
      float,
      ...style,
    },
    ...props
  };
  if (useAnchor) {
    return <a {...composedProps} />;
  }
  return <button {...composedProps} />;
};

export default Button;