import React from 'react';
import { orderedDrivers } from '../lib/availableDrivers';
import Container from '@material-ui/core/Container';
import Grid, { GridTypeMap } from '@material-ui/core/Grid';
import styled from 'styled-components';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

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

const DriverSelector = ({ onSelect, selected }) => (
  <>
    <h5>Select your database driver</h5>
    <hr/>
    <Container maxWidth='sm'>
      <Grid container spacing={2} autoCapitalize='center'>
        {orderedDrivers.map(driver => (
          <DBDriverItem item key={driver.value} xs={3} selected={selected === driver.value}>
            <div onClick={() => onSelect(driver)}>
              <img src={`${(window as any).extRoot}/${driver.icon}`} />
              <div>{driver.text}</div>
            </div>
          </DBDriverItem>
        ))}
      </Grid>
    </Container>
  </>
);

export default DriverSelector;
