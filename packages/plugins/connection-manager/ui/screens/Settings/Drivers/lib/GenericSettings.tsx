import React, { useState } from 'react';
import Text from '../../Fields/Text';
import Checkbox from '../../Fields/Checkbox';
import Select from '../../Fields/Select';
import availableDrivers from '../../lib/availableDrivers';
import FileInput from '../../Fields/FileInput';

enum ConnectionMethod {
  ServerAndPort = 'Server and Port',
  SocketFile = 'Socket File',
  ConnectionString = 'Connection String'
};

const ConnectionMethods = [
  ConnectionMethod.ServerAndPort,
  ConnectionMethod.SocketFile,
  ConnectionMethod.ConnectionString,
];


const GenericSettings = ({ settings, updateSettings, dbFieldName = 'Database', dbFieldRequired = true, defaultMethod = ConnectionMethod.ServerAndPort, allowChangeMethod = true, errors = {} }) => {
  const [ method, setMethod ] = useState(defaultMethod || ConnectionMethod.ServerAndPort);
  const changeMethod = method => {
    const newSettings = settings;
    switch (method) {
      case ConnectionMethod.ServerAndPort:
        delete newSettings.socketPath;
        delete newSettings.connectString;
        newSettings.port = availableDrivers[settings.driver].port;
        newSettings.server = 'localhost';
        newSettings.askForPassword = true;
        break;
      case ConnectionMethod.SocketFile:
        delete newSettings.server;
        delete newSettings.port;
        delete newSettings.connectString;
        newSettings.askForPassword = true;
        break;
      case ConnectionMethod.ConnectionString:
        delete newSettings.socketPath;
        delete newSettings.server;
        delete newSettings.port;
        delete newSettings.connectString;
        delete newSettings.username;
        delete newSettings.password;
        delete newSettings.database;
        delete newSettings.askForPassword;
        break;
    }
    updateSettings(newSettings, () => setMethod(method));
  };
  const hasError: any = errors || {};
  return (
    <>
      <Text
        label='Connection Name*'
        onChange={name => updateSettings({ name })}
        value={settings.name}
        hasError={hasError.name}
      />
      {
        allowChangeMethod &&
        <Select
          label='Connection Method*'
          options={ConnectionMethods}
          value={method}
          onChange={changeMethod}
        />
      }
      {
        method === ConnectionMethod.ServerAndPort &&
        <Text
          label='Server host*'
          onChange={server => updateSettings({ server })}
          value={settings.server}
          hasError={hasError.server}
        />
      }
      {
        method === ConnectionMethod.ServerAndPort &&
        <Text
          label='Port*'
          onChange={port => updateSettings({ port: parseInt(port) })}
          value={settings.port}
          type='number'
          min='0'
          hasError={hasError.port}
        />
      }
      {
        method === ConnectionMethod.SocketFile &&
        <FileInput
          label="Socket File*"
          onChange={({ file: socketPath }) => updateSettings({ socketPath })}
          value={settings.socketPath}
          hasError={hasError.socketPath}
        />
      }
      {
        method !== ConnectionMethod.ConnectionString &&
        <Text
        label={`${dbFieldName}${dbFieldRequired ? '*' : ''}`}
        onChange={database => updateSettings({ database })}
        value={settings.database}
        hasError={hasError.database}
        />
      }
      {
        method !== ConnectionMethod.ConnectionString &&
        <Text
        label='Username*'
        onChange={username => updateSettings({ username })}
        value={settings.username}
        hasError={hasError.username}
        />
      }
      {
        method !== ConnectionMethod.ConnectionString &&
        <Text
        label='Password'
        onChange={password => updateSettings({ password, askForPassword: password ? undefined : (typeof settings.askForPassword !== 'undefined' ? settings.askForPassword : true) })}
        value={settings.password}
        hasError={hasError.password}
        />
      }
      {
        method === ConnectionMethod.ConnectionString &&
        <Text
        label='Connection String*'
        onChange={connectString => updateSettings({ connectString })}
        value={settings.connectString}
        hasError={hasError.connectString}
        />
      }
      {
        method !== ConnectionMethod.ConnectionString && !settings.password &&
        <Checkbox
        label='Ask Password?'
        onChange={askForPassword => updateSettings({ askForPassword })}
        value={settings.askForPassword}
        helperText='Leave unchecked to use empty passwords'
        />
      }
      <Text
        label='Timeout'
        onChange={connectionTimeout => updateSettings({ connectionTimeout: parseInt(connectionTimeout) })}
        value={settings.connectionTimeout}
        type='number'
        min='0'
        helperText='Time in seconds'
      />
    </>
  );
}

export default GenericSettings;