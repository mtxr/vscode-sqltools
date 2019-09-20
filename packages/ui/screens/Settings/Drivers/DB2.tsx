import React from 'react';
import GenericSettings from './lib/GenericSettings';

const DB2 = ({ settings, updateSettings, ...props }) => (
  <GenericSettings settings={settings} updateSettings={updateSettings} {...props}/>
);
// @TODO: add driver specifv settings here

export default DB2;