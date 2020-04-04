import React from 'react';
import { Tabs, Tab, Typography } from '@material-ui/core';

interface Props {
  items: string[];
  active: number;
  onChange: (index: number) => void;
}

const QueryTabs: React.SFC<Props> = ({ items, active, onChange }) => {
  if (items.length <= 1) return null;
  return (
    <Tabs
      value={active}
      onChange={(_e, index) => onChange(index)}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="on"
    >
      {items.map((name: string, index: number) => (
        <Tab
          disableFocusRipple
          disableRipple
          key={index}
          label={
            <Typography
              variant="inherit"
              noWrap
              style={{
                width: '100%',
                textTransform: 'initial'
              }}
            >
              {name}
            </Typography>
          }
        />
      ))}
    </Tabs>
  );
}

export default QueryTabs;