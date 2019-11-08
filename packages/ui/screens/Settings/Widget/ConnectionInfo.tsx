import React from 'react';
import get from 'lodash/get';
import availableDrivers from '../lib/availableDrivers';
import './ConnectionInfo.scss';
import DriverSettings from './../Drivers';
import Checkbox from '../Fields/Checkbox';
import Text from '../Fields/Text';

const ConnectionInfo = ({ updateSettings, submit, toggleGlobal, toggleUseRelative, testConnection, openConnectionFile, state: { connectionSettings, errors = {}, defaultMethod = null, ...state } }) => {
  const SelectedDriverSettings = DriverSettings[connectionSettings.driver] || (() => null) as any;
  return (
    <>
      <h5>Connection Settings</h5>
      <hr/>
      {get(availableDrivers, [connectionSettings.driver, 'icon']) && <img className={'selected-driver-icon'} src={`${(window as any).extRoot}/${get(availableDrivers, [connectionSettings.driver, 'icon'])}`} />}
      <form onSubmit={submit}>
        <SelectedDriverSettings
          settings={connectionSettings}
          updateSettings={updateSettings}
          defaultMethod={defaultMethod}
          errors={errors}
          toggleUseRelative={toggleUseRelative}
        />
        <ConnectionInfo.Common state={state} toggleGlobal={toggleGlobal} updateSettings={updateSettings} settings={connectionSettings}/>
        <ConnectionInfo.Footer errors={errors} state={state} testConnection={testConnection} openConnectionFile={openConnectionFile}/>
      </form>
      {/* {<pre>{JSON.stringify(connectionSettings, null, 2)}</pre>} */}
      {/* {<pre>{JSON.stringify(errors, null, 2)}</pre>} */}
      {/* {<pre>{JSON.stringify(state, null, 2)}</pre>} */}
    </>
  );
}

ConnectionInfo.Footer = ({ errors, testConnection, state, openConnectionFile }) => (
  <div style={{ paddingTop: '12px', paddingBottom: '18px', lineHeight: 1.7 }}>
    <button
      className='btn connect'
      type='submit'
      disabled={Object.keys(errors).length > 0}
    >
      Save Connection
    </button>
    <button
      className='btn'
      disabled={Object.keys(errors).length > 0}
      onClick={testConnection}
      style={{ float: 'right' }}
      type="button"
    >
      Test Connection
    </button>
    {!`${state.action || 'create'}`.startsWith('create') && Object.keys(errors).length === 0 && <a
      onClick={openConnectionFile}
      style={{
        float: 'right',
        cursor: 'pointer',
        textDecoration: 'underline',
        color: 'inherit',
        marginRight: '2em'
      }}
    >
      Open settings
    </a>}
  </div>
);

ConnectionInfo.Common = ({ state, toggleGlobal, updateSettings, settings }) => (console.log({ settings }),
  <>
  <Text
    label='Connection Group'
    onChange={group => updateSettings({ group })}
    value={settings.group}
    helperText={`Optional. Connection explorer group name`}
  />
  {`${state.action || 'create'}`.startsWith('create') && <Checkbox
    label='Save To Global Settings?'
    onChange={global => toggleGlobal(global)}
    helperText='If checked, this connection will be saved in global settings'
    value={state.globalSetting}
    disabled={!`${state.action || 'create'}`.startsWith('create')}
  />}
  {state.externalMessage && <div style={{ paddingTop: '12px', paddingBottom: '18px' }}>
    <span className={`message message-${state.externalMessageType}`}>
      {state.externalMessage}
    </span>
  </div>}
  </>
);

export default ConnectionInfo;