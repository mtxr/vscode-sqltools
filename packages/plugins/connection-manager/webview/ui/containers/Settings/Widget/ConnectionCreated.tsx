import React from 'react';
import Syntax from '../../../components/Syntax';
import Button from '../../../components/Button';
import DriverIcon  from '../../../components/DriverIcon';
import { SettingsScreenState } from '../interfaces';
import { UIAction } from '../../../../../actions';

const ConnectionCreated = ({
  formData,
  action,
  reset,
  driver
}: {
  formData: SettingsScreenState['formData'];
  action: SettingsScreenState['action']
  reset: () => void;
  driver: SettingsScreenState['driver']
}) => {
  const { id, ...connSettings } = formData;
  return (
    <>
      <h5>Review connection details</h5>
      <hr />
      <DriverIcon driver={driver} />
      <div style={{ minHeight: '150px' }}>
        <h4>
          {action === UIAction.RESPONSE_CREATE_CONNECTION_SUCCESS && `${formData.name} was added to your settings!`}
          {action === UIAction.RESPONSE_UPDATE_CONNECTION_SUCCESS && `${formData.name} updated!`}
        </h4>
        <details open>
          <summary>Review JSON Syntax</summary>
          <Syntax code={connSettings} language="json" width='calc(100% - 100px)' />
        </details>
        <div style={{ paddingTop: '50px' }}>
          <Button a
            onClick={reset}
            bg="var(--vscode-list-highlightForeground)"
            href={encodeURI(
              `command:${process.env.EXT_NAMESPACE || 'sqltools'}.selectConnection?${JSON.stringify(formData.id)}`
            )}
          >
            Connect now
          </Button>
          <Button a
            onClick={reset}
            bg="var(--vscode-editorError-foreground)"
            float="right"
            href={encodeURI(
              `command:${process.env.EXT_NAMESPACE || 'sqltools'}.deleteConnection?${JSON.stringify(formData.id)}`
            )}
          >
            Delete {formData.name}
          </Button>
          <Button onClick={reset} float="right">
            Create another
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConnectionCreated;
