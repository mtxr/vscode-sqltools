import React from 'react';
import styles from './style.m.scss';

const ViewContainer: React.SFC<React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>> = ({ className, ...props }) => (
  <div
    className={`${styles.container} ${(className || '')}`}
    {...(props)}
  />
);

export default ViewContainer;
