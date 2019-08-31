import React from 'react';
import get from 'lodash/get';
import availableDialects from '../lib/availableDialects';
import './ConnectionInfo.scss';
import DriverSettings from './../Drivers';

const ConnectionInfo = ({ updateSettings, submit, testConnection, state: { connectionSettings, errors = {}, defaultMethod = null, ...state } }) => {
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
    </>
  );
}

export default ConnectionInfo;