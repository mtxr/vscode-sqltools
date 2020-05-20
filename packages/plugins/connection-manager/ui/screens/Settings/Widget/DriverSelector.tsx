import React from 'react';
import Container from '@material-ui/core/Container';
import Grid, { GridTypeMap } from '@material-ui/core/Grid';
import styled from 'styled-components';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import Message from '../../../components/Message';
import { SettingsScreenState } from '../interfaces';

const DBDriverItem = styled<OverridableComponent<GridTypeMap<{ selected?: boolean }, 'div'>>>(Grid)`
  max-width: 250px;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 130px;
    cursor: pointer;
    justify-content: center;
    background: ${p => p.selected ? 'var(--vscode-menu-selectionBackground)' : null};
    color: ${p => p.selected ? 'var(--vscode-menu-selectionForeground)' : null};

    div, img {
      font-weight: bold;
      text-align: center;
    }

    &:hover {
      background: var(--vscode-menu-selectionBackground);
      color: var(--vscode-menu-selectionForeground);
    }
  }
`;

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
          <DBDriverItem item key={driver.value} xs={3} selected={selected && selected.value === driver.value}>
            <div onClick={() => onSelect(driver)}>
              <img src={driver.icon} />
              <div>{driver.displayName}</div>
            </div>
          </DBDriverItem>
        ))}
      </Grid>}
      {!loading && drivers.length === 0 && <Grid style={{ textAlign: 'center', padding: '5rem', height: '10rem', justifyContent: 'space-evenly', flexDirection: 'column', display: 'flex' }}>
        <div><Message type='error' >No drivers installed</Message></div>
        <div><a href='https://marketplace.visualstudio.com/search?term=sqltools%20driver&target=VSCode'>Search VSCode marketplace</a></div>
      </Grid>}
    </Container>
  </>
);

export default DriverSelector;
