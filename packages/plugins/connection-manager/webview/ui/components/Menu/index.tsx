import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { Divider, Menu, Typography } from '@material-ui/core';

export default ({ position, onSelect, onClose, anchorEl, options = [], width = 200 }) => {
  if (!anchorEl) return null;
  const { x, y } = position || {} as any;
  return (
    <Menu
      id="context-menu"
      anchorReference='anchorPosition'
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={() => (onClose && onClose(), onSelect(null))}
      disablePortal
      anchorPosition={{
        top: y,
        left: x
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
          <MenuItem key={opt.value || opt.label || opt} onClick={() => onSelect(opt.value || opt.label || opt)} disabled={opt.disabled}>
            <Typography variant="inherit" noWrap>
            {opt.label || opt.value || opt}
            </Typography>
          </MenuItem>
        );
      })}
    </Menu>
  );
};
