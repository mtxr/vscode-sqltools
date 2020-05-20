import React from 'react';
import get from 'lodash/get';
import Syntax from '../../../components/Syntax';
import Button from '../../../components/Button';
import DriverIcon  from '../../../components/DriverIcon';

const ConnectionCreated = ({ settings, action, reset, installedDrivers }) => {
  const { id, ...connSettings } = settings;
  return (
    <>
      <h5>Review connection details</h5>
      <hr />
      <DriverIcon icon={get(installedDrivers, [settings.driver, 'icon'])} />
      <div style={{ minHeight: '150px' }}>
        <h5>
          {action === 'createConnectionSuccess' && `${settings.name} added to your settings!`}
          {action === 'updateConnectionSuccess' && `${settings.name} updated!`}
        </h5>
        <details open>
          <summary>Review JSON Syntax</summary>
          <Syntax code={connSettings} language="json" width='calc(100% - 100px)' />
        </details>
        <div style={{ paddingTop: '50px' }}>
          <Button.a
            onClick={reset}
            bg="var(--vscode-list-highlightForeground)"
            href={encodeURI(
              `command:${process.env.EXT_NAMESPACE || 'sqltools'}.selectConnection?${JSON.stringify(settings.id)}`
            )}
          >
            Connect now
          </Button.a>
          <Button.a
            onClick={reset}
            bg="var(--vscode-editorError-foreground)"
            float="right"
            href={encodeURI(
              `command:${process.env.EXT_NAMESPACE || 'sqltools'}.deleteConnection?${JSON.stringify(settings.id)}`
            )}
          >
            Delete {settings.name}
          </Button.a>
          <Button onClick={reset} float="right">
            Create another
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConnectionCreated;
