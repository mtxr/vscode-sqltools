import React from 'react';
import styled from 'styled-components';
const Img = styled.img`
  float: right;
`;
const DriverIcon = ({ icon }) => icon && <Img src={`${(window as any).extRoot}/${icon}`} />;

export default DriverIcon;
