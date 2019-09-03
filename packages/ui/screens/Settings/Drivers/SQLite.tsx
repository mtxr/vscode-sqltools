import React from 'react';
import Text from '../Fields/Text';
import FileInput from '../Fields/FileInput';

const SQLite = ({ settings, updateSettings }) => (
  <>
    <Text label='Connection Name*' onChange={name => updateSettings({ name })} value={settings.name} />
    <FileInput label='Database File*' onChange={database => updateSettings({ database })} value={settings.database} />
  </>
);
// @TODO: add driver specifv settings here

export default SQLite;
