import React from 'react';
import get from 'lodash/get';
import availableDrivers from '../lib/availableDrivers';
import './ConnectionCreated.scss';
import Syntax from '../../../components/Syntax';

const ConnectionCreated = ({ settings, action, reset }) => {
  const { id, ...connSettings } = settings;
  return (
    <>
      <h5>Review connection details</h5>
      <hr/>
      {get(availableDrivers, [settings.driver, 'icon']) && <img className={'selected-driver-icon'} src={`${(window as any).extRoot}/${get(availableDrivers, [settings.driver, 'icon'])}`} />}
      <div style={{ minHeight: '150px' }}>
        <h5>
          {action === 'createConnectionSuccess' && `${settings.name} added to your settings!`}
          {action === 'updateConnectionSuccess' && `${settings.name} updated!`}
        </h5>
        <details open>
          <summary>
            Review JSON Syntax
          </summary>
          <Syntax code={connSettings} language='json' style={{ width: 'calc(100% - 100px)' }}/>
        </details>
        <div style={{ paddingTop: '50px' }}>
          <a onClick={reset} className="btn connect" href={encodeURI(`command:${process.env.EXT_NAME || 'sqltools'}.selectConnection?${JSON.stringify(settings.id)}`)}>Connect now</a>
          <a onClick={reset} className="btn delete" style={{ float: 'right' }} href={encodeURI(`command:${process.env.EXT_NAME || 'sqltools'}.deleteConnection?${JSON.stringify(settings.id)}`)}>Delete {settings.name}</a>
          <button onClick={reset} className="btn " style={{ float: 'right' }}>Create another</button>
        </div>
      </div>
    </>
  );
}

export default ConnectionCreated;