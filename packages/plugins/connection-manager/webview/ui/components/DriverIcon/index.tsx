import React from 'react';
import { SettingsScreenState } from '../../screens/Settings/interfaces';
import style from './style.m.scss';

const DriverIcon = ({ driver }: { driver: SettingsScreenState['driver'] }) => {
  if (!driver || !driver.icon) return null;
  return <img className={style.driverIcon} src={driver.icon} />;
}
export default DriverIcon;
