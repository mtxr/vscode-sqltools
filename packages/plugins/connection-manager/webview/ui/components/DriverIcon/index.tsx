import React from 'react';
import { IDriver } from '../../screens/Settings/interfaces';
import style from './style.m.scss';

const DriverIcon = ({ driver }: { driver: IDriver }) => {
  if (!driver || !driver.icon) return null;
  return <img className={style.driverIcon} src={driver.icon} />;
};
export default DriverIcon;
