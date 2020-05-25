import React from 'react';
import Container from '@material-ui/core/Container';
import Grid, { GridTypeMap } from '@material-ui/core/Grid';
import styled from 'styled-components';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import Message from '../../../components/Message';
import { SettingsScreenState } from '../interfaces';
import { CircularProgress } from '@material-ui/core';

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
      {!loading && drivers.length > 0 && <div>
        <p>
          <a href={`command:workbench.extensions.search?${encodeURIComponent('"@tag:sqltools-driver"')}`}>
            Get more drivers
          </a>
        </p>
      </div>}
    </Container>
  </>
);

export default DriverSelector;
