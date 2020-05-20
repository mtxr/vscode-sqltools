import React from 'react';
import styled from 'styled-components';
import { SettingsScreenState } from '../screens/Settings/interfaces';
const Img = styled.img`
  float: right;
`;
const DriverIcon = ({ driver }: { driver: SettingsScreenState['driver'] }) => (driver && driver.icon && <Img src={driver.icon} />) || null;

export default DriverIcon;
