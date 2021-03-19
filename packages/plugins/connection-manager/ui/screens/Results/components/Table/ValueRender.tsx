import React from 'react';
export const ValueRender = ({ value }) => {
  if (value === null) return <small className="cell-value value-null">NULL</small>;
  if (typeof value === 'number') return <span className="cell-value value-number">{value}</span>;
  if (value === true || value === false)
    return <span className={`cell-value value-bool ${value.toString()}`}>{value.toString().toUpperCase()}</span>;
  if (typeof value === 'object' || Array.isArray(value)) {
    return <>{JSON.stringify(value, null, 2)}</>;
  }
  return <>{String(value)}</>;
};

export default ValueRender;
