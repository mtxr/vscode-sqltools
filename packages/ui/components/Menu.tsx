import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Divider, Menu, Typography } from '@material-ui/core';

export default ({ position, onSelect, open, options = [], width = 200 }) => {
  if (!open) return null;
  const { pageX, pageY } = position || {} as any;
  return (
    <Menu
      id="context-menu"
      anchorReference='anchorPosition'
      open={open}
      onClose={() => onSelect(null)}
      disablePortal
      keepMounted
      getContentAnchorEl={null}
      anchorPosition={{
        top: pageY,
        left: pageX
      }}
      PaperProps={{
        style: {
          width,
        },
      }}
    >
      {options.map((opt, index) => {
        if (opt === 'sep' || opt.value === 'sep') {
          return <Divider key={index} variant="fullWidth" component="li" />;
        }
        return (
          <MenuItem key={opt.value || opt.label || opt} onClick={() => onSelect(opt.value || opt.label || opt)}>
            <Typography variant="inherit" noWrap>
            {opt.label || opt}
            </Typography>
          </MenuItem>
        );
      })}
    </Menu>
  );
};
