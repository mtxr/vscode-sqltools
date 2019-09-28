import React from 'react';
import get from 'lodash/get';
import availableDialects from '../lib/availableDialects';
import './ConnectionInfo.scss';
import DriverSettings from './../Drivers';
import Checkbox from '../Fields/Checkbox';

const ConnectionInfo = ({ updateSettings, submit, toggleGlobal, testConnection, state: { connectionSettings, errors = {}, defaultMethod = null, ...state } }) => {
  const SelectedDriverSettings = DriverSettings[connectionSettings.dialect] || (() => null) as any;
  return (
    <>
      <h5>Connection Settings</h5>
      <hr/>
      {get(availableDialects, [connectionSettings.dialect, 'icon']) && <img className={'selected-driver-icon'} src={`${(window as any).extRoot}/${get(availableDialects, [connectionSettings.dialect, 'icon'])}`} />}
      <form onSubmit={submit}>
        <SelectedDriverSettings
          settings={connectionSettings}
          updateSettings={updateSettings}
          defaultMethod={defaultMethod}
          errors={errors}
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
        <div style={{ paddingTop: '12px', paddingBottom: '18px' }}>
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
        </div>
      </form>
      {/* {<pre>{JSON.stringify(connectionSettings, null, 2)}</pre>} */}
      {/* {<pre>{JSON.stringify(errors, null, 2)}</pre>} */}
      {/* {<pre>{JSON.stringify(state, null, 2)}</pre>} */}
    </>
  );
}

export default ConnectionInfo;