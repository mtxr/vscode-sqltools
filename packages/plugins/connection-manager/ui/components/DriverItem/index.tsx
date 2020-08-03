import React from 'react';
import { SettingsScreenState } from '../../screens/Settings/interfaces';
import Grid from '@material-ui/core/Grid';
import DriverIcon from '../DriverIcon';
import style from './style.m.scss';

export const DriverItem = ({ driver, selected, onSelect }: { driver: SettingsScreenState['driver']; selected: boolean; onSelect: () => void }) => (
  <Grid item xs={3} className={selected ? style.itemSelected : style.item}>
    <div onClick={onSelect}>
      <DriverIcon driver={driver} />
      <div>{driver.displayName}</div>
    </div>
  </Grid>
)