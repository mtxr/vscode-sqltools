import React from 'react';
import Syntax from '../../../../components/Syntax';
import Button from '../../../../components/Button';
import DriverIcon from '../../../../components/DriverIcon';
import useDriver from '../../hooks/useDriver';
import useStep from '../../hooks/useStep';
import { Step } from '../../lib/steps';
import useContextAction from '../../hooks/useContextAction';
import useResponseMessages from '../../hooks/useResponseMessages';
import useFormData from '../../hooks/useFormData';

const ConnectionCreatedStepWidget = () => {
  const { driver } = useDriver();
  const { step } = useStep();
  const { externalMessage } = useResponseMessages();
  const { id, ...connSettings } = useFormData();
  const { reset } = useContextAction();

  if (step !== Step.CONNECTION_SAVED) return null;

  return (
    <>
      <h5>Review connection details</h5>
      <hr />
      <DriverIcon driver={driver} />
      <div style={{ minHeight: '150px' }}>
        <h4>{externalMessage}</h4>
        <details open>
          <summary>Review JSON Syntax</summary>
          <Syntax
            code={connSettings}
            language='json'
            width='calc(100% - 100px)'
          />
        </details>
        <div style={{ paddingTop: '50px' }}>
          <Button
            a
            onClick={reset}
            bg='var(--vscode-list-highlightForeground)'
            href={encodeURI(
              `command:${
                process.env.EXT_NAMESPACE || 'sqltools'
              }.selectConnection?${JSON.stringify(id)}`
            )}
          >
            Connect now
          </Button>
          <Button
            a
            onClick={reset}
            bg='var(--vscode-editorError-foreground)'
            float='right'
            href={encodeURI(
              `command:${
                process.env.EXT_NAMESPACE || 'sqltools'
              }.deleteConnection?${JSON.stringify(id)}`
            )}
          >
            Delete {connSettings.name}
          </Button>
          <Button onClick={reset} float='right'>
            Create another
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConnectionCreatedStepWidget;
