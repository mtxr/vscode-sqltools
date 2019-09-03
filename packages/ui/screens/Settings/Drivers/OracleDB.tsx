import React from 'react';
import GenericSettings from './lib/GenericSettings';

const OracleDB = ({ settings, updateSettings, ...props }) => (
  <GenericSettings settings={settings} updateSettings={updateSettings} {...props}/>
);
// @TODO: add driver specifv settings here

export default OracleDB;