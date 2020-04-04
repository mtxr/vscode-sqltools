import React from 'react';
import { TableFilterRow } from '@devexpress/dx-react-grid-material-ui';
import Code from '@material-ui/icons/Code';
const FilterIcon = ({ type, ...restProps }) => {
  if (type === 'regex') return <Code {...restProps} />;
  return <TableFilterRow.Icon type={type} {...restProps} />;
};
export default FilterIcon;
