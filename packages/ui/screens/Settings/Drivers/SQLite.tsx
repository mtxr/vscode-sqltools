import React from 'react';
import Text from '../Fields/Text';
import FileInput from '../Fields/FileInput';

const SQLite = ({ settings, updateSettings, toggleUseRelative }) => (
  <>
    <Text label='Connection Name*' onChange={name => updateSettings({ name })} value={settings.name} />
    <FileInput label='Database File*' onChange={({ file: database, transformToRelative }) => (updateSettings({ database }), toggleUseRelative(transformToRelative))} value={settings.database} />
  </>
);
// @TODO: add driver specific settings here

export default SQLite;
