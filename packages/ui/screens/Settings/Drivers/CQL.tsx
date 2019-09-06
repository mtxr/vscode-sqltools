import React from 'react';
import GenericSettings from './lib/GenericSettings';

const CQL = ({ settings, updateSettings, ...props }) => (
  <GenericSettings settings={settings} updateSettings={updateSettings} dbFieldName='Keyspace' dbFieldRequired={false} allowChangeMethod={false} {...props}/>
);
// @TODO: add driver specifv settings here

export default CQL;