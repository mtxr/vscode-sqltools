import React from 'react';
import { Tabs, Tab, Typography } from '@material-ui/core';
import useTabs from '../../hooks/useTabs';
import styles from './style.m.scss';

const QueryTabs = () => {
  const { tabs, activeTab, toggleTab } = useTabs();
  if (tabs.length <= 1) return null;
  return (
    <Tabs
      value={activeTab}
      onChange={(_e, index) => toggleTab(index)}
      indicatorColor='primary'
      textColor='primary'
      variant='scrollable'
      scrollButtons='on'
      className={styles.container}
    >
      {tabs.map((name: string, index: number) => (
        <Tab
          disableFocusRipple
          disableRipple
          key={index}
          label={
            <Typography
              variant='inherit'
              noWrap
              style={{
                width: '100%',
                textTransform: 'initial',
              }}
            >
              {name}
            </Typography>
          }
        />
      ))}
    </Tabs>
  );
};

export default QueryTabs;
