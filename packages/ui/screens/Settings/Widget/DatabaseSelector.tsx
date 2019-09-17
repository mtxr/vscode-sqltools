import React from 'react';
import { orderedDialect } from '../lib/availableDialects';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import './DatabaseSelect.scss';

const DatabaseSelector = ({ onSelect, selected }) => (
  <>
    <h5>Select your database driver</h5>
    <hr/>
    <Container maxWidth='sm'>
      <Grid container spacing={2} autoCapitalize='center'>
        {orderedDialect.map(dialect => (
          <Grid item key={dialect.value} xs={3} className={`db-item ${selected === dialect.value ? 'selected' : ''}`}>
            <div onClick={() => onSelect(dialect)}>
              <img src={`${(window as any).extRoot}/${dialect.icon}`} />
              <div>{dialect.text}</div>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  </>
);

export default DatabaseSelector;
