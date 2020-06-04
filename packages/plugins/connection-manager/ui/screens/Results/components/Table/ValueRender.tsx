import React from 'react';
export const ValueRender = ({ value }) => {
  if (value === null)
    return <small className='cell-value value-null'>NULL</small>;
  if (typeof value === 'number')
    return <span className='cell-value value-number'>{value}</span>;
  if (value === true || value === false)
    return <span className={`cell-value value-bool ${value.toString()}`}>{value.toString().toUpperCase()}</span>;
  if (typeof value === 'object' || Array.isArray(value)) {
    return (<>{JSON.stringify(value, null, 2)}</>);
  }
  return <>{String(value)}</>;
    // DISABLE! Performance issues here
    // return <span>
    //   {
    //     value.replace(this.state.filtered[r.column.id].regex || this.state.filtered[r.column.id].value, '<###>$1<###>')
    //     .split('<###>')
    //     .map((str, i) => {
    //       if (i % 2 === 1)
    //         return (
    //           <mark key={i} className="filter-highlight">
    //             {str}
    //           </mark>
    //         );
    //       if (str.trim().length === 0) return null;
    //       return <span key={i}>{str}</span>;
    //     })
    //   }
    // </span>
};

export default ValueRender;