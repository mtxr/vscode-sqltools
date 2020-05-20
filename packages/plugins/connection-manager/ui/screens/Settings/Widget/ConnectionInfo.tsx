import React from 'react';
import get from 'lodash/get';
import DriverSettings from './../Drivers';
import Checkbox from '../Fields/Checkbox';
import Text from '../Fields/Text';
import DriverIcon from '../../../components/DriverIcon';
import Message from '../../../components/Message';
import Button from '../../../components/Button';
import A from '../../../components/A';

const ConnectionInfo = ({
  updateSettings,
  submit,
  toggleGlobal,
  toggleUseRelative,
  testConnection,
  openConnectionFile,
  installedDrivers = {},
  state: { connectionSettings, errors = {}, defaultMethod = null, ...state },
}) => {
  const SelectedDriverSettings = DriverSettings[connectionSettings.driver] || ((() => null) as any);
  return (
    <>
      <h5>Connection Settings</h5>
      <hr />
      <DriverIcon icon={get(installedDrivers, [connectionSettings.driver, 'icon'])} />
      <form onSubmit={submit}>
        <SelectedDriverSettings
          settings={connectionSettings}
          updateSettings={updateSettings}
          defaultMethod={defaultMethod}
          errors={errors}
          toggleUseRelative={toggleUseRelative}
        />
        <ConnectionInfo.Common
          state={state}
          toggleGlobal={toggleGlobal}
          updateSettings={updateSettings}
          settings={connectionSettings}
        />
        <ConnectionInfo.Footer
          errors={errors}
          state={state}
          testConnection={testConnection}
          openConnectionFile={openConnectionFile}
        />
      </form>
      {/* {<pre>{JSON.stringify(connectionSettings, null, 2)}</pre>} */}
      {/* {<pre>{JSON.stringify(errors, null, 2)}</pre>} */}
      {/* {<pre>{JSON.stringify(state, null, 2)}</pre>} */}
    </>
  );
};

ConnectionInfo.Footer = ({ errors, testConnection, state, openConnectionFile }) => (
  <div style={{ paddingTop: '12px', paddingBottom: '18px', lineHeight: 1.7 }}>
    <Button bg="var(--vscode-list-highlightForeground)" type="submit" disabled={Object.keys(errors).length > 0}>
      Save Connection
    </Button>
    <Button disabled={Object.keys(errors).length > 0} onClick={testConnection} float="right" type="button">
      Test Connection
    </Button>
    {!`${state.action || 'create'}`.startsWith('create') && Object.keys(errors).length === 0 && (
      <A onClick={openConnectionFile} float="right" style={{ marginRight: '2em' }}>
        Open settings
      </A>
    )}
  </div>
);

ConnectionInfo.Common = ({ state, toggleGlobal, updateSettings, settings }) => (
  <>
    <Text
      label="Connection Group"
      onChange={group => updateSettings({ group })}
      value={settings.group}
      helperText={`Optional. Connection explorer group name`}
    />
    {`${state.action || 'create'}`.startsWith('create') && (
      <Checkbox
        label="Save To Global Settings?"
        onChange={global => toggleGlobal(global)}
        helperText="If checked, this connection will be saved in global settings"
        value={state.globalSetting}
        disabled={!`${state.action || 'create'}`.startsWith('create')}
      />
    )}
    {state.externalMessage && (
      <div style={{ paddingTop: '12px', paddingBottom: '18px' }}>
        <Message type={state.externalMessageType}>{state.externalMessage}</Message>
      </div>
    )}
  </>
);

export default ConnectionInfo;
