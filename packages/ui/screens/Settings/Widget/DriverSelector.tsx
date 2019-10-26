import React from 'react';
import { orderedDrivers } from '../lib/availableDrivers';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import './DriverSelector.scss';

const DriverSelector = ({ onSelect, selected }) => (
  <>
    <h5>Select your database driver</h5>
    <hr/>
    <Container maxWidth='sm'>
      <Grid container spacing={2} autoCapitalize='center'>
        {orderedDrivers.map(driver => (console.log(driver),
          <Grid item key={driver.value} xs={3} className={`db-item ${selected === driver.value ? 'selected' : ''}`}>
            <div onClick={() => onSelect(driver)}>
              <img src={`${(window as any).extRoot}/${driver.icon}`} />
              <div>{driver.text}</div>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  </>
);

export default DriverSelector;
