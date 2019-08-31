import React from 'react';
import GenericSettings from './lib/GenericSettings';

const SAPHana = ({ settings, updateSettings, ...props }) => (
  <GenericSettings settings={settings} updateSettings={updateSettings} dbFieldName='Schema' {...props}/>
);
// @TODO: add driver specifv settings here

export default SAPHana;