import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Message from '../../../components/Message';
import { SettingsScreenState } from '../interfaces';
import { CircularProgress } from '@material-ui/core';
import { DriverItem } from '../../../components/DriverItem';

const DriverSelector = ({
  onSelect,
  selected,
  drivers = [],
  loading
}: {
  loading: SettingsScreenState['loading'];
  selected: SettingsScreenState['driver'];
  drivers: SettingsScreenState['installedDrivers'];
  onSelect: (driver: SettingsScreenState['driver']) => void;
}) => (
  <>
    <h5>Select your database driver</h5>
    <hr/>
    <Container maxWidth='sm'>
      {drivers.length > 0 && <Grid container spacing={2} autoCapitalize='center'>
        {drivers.map(driver => (
          <DriverItem
            key={driver.value}
            selected={selected && selected.value === driver.value}
            driver={driver}
            onSelect={() => onSelect(driver)}
          />
        ))}
      </Grid>}
      {!loading && drivers.length === 0 && <Grid style={{ textAlign: 'center', height: '400px', justifyContent: 'space-evenly', flexDirection: 'column', display: 'flex', boxSizing: 'content-box' }}>
        <div>
          <Message>
            Couldn't find any drivers installed yet.
            <p>
              <a href={`command:workbench.extensions.search?${encodeURIComponent('"@tag:sqltools-driver"')}`}>
                Search VSCode marketplace
              </a>
            </p>
          </Message>
        </div>
        <div>
          <CircularProgress size='20px'/>
          <p>
            <strong>Don't worry, we are still looking up for drivers.<br />Try to install drivers before move forward.</strong>
          </p>
        </div>
      </Grid>}
      {!loading && drivers.length > 0 && <Grid style={{ textAlign: 'center', height: '120px', justifyContent: 'space-evenly', flexDirection: 'column', display: 'flex', boxSizing: 'content-box' }}>
        <p>
          <a href={`command:workbench.extensions.search?${encodeURIComponent('"@tag:sqltools-driver"')}`}>
            Get more drivers
          </a>
        </p>
      </Grid>}
    </Container>
  </>
);

export default DriverSelector;
