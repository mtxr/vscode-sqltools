import React from 'react';
import styles from './style.m.scss';

export const CellValue = ({ value }) => {
  if (value === null) return <code className={styles.cellValue}>NULL</code>;
  if (typeof value === 'number')
    return <code className={styles.cellValue}>{value}</code>;
  if (value === true || value === false)
    return (
      <code className={styles[value.toString()]}>
        {value.toString().toUpperCase()}
      </code>
    );
  if (typeof value === 'object' || Array.isArray(value)) {
    return <code>{JSON.stringify(value, null, 2)}</code>;
  }
  return <>{String(value)}</>;
};

export default CellValue;
