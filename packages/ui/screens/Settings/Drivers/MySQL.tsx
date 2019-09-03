import React from 'react';
import GenericSettings from './lib/GenericSettings';

const MySQL = ({ settings, updateSettings, ...props }) => (
  <GenericSettings settings={settings} updateSettings={updateSettings} {...props}/>
);

// @TODO: add driver specifv settings here

export default MySQL;