import React from 'react';
import DriverIcon from '../../../components/DriverIcon';
import Button from '../../../components/Button';
import A from '../../../components/A';
import { SettingsScreenState } from '../interfaces';
import Form, { FormProps } from '@rjsf/core';
import { IConnection } from '@sqltools/types';
import Syntax from '../../../components/Syntax';
import FileWidget from './FileWidget';
import { UIAction } from '../../../../actions';
import Message from '../../../components/Message';

const ConnectionSettingsForm = ({
  onSubmit,
  onChange,
  testConnection,
  openConnectionFile,
  formData = {},
  schema = {},
  uiSchema = {},
  driver,
  action,
  testResults: {
    externalMessage,
    externalMessageType
  } = {},
}: {
  onSubmit: FormProps<any>['onSubmit'];
  onChange: FormProps<any>['onChange'];
  testConnection: () => void;
  openConnectionFile: () => void;
  formData: FormProps<Partial<IConnection>>['formData'];
  schema: FormProps<IConnection>['schema'];
  uiSchema: FormProps<IConnection>['uiSchema'];
  driver: SettingsScreenState['driver'];
  action: SettingsScreenState['action'];
  installedDrivers: SettingsScreenState['installedDrivers'];
  testResults?: {
    externalMessage?: string;
    externalMessageType?: SettingsScreenState['externalMessageType'];
  };
}) => {
  return (
    <>
      <h5>Connection Settings</h5>
      <hr />
      <DriverIcon driver={driver} />
      <Form
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        onChange={onChange}
        formData={formData}
        widgets={widgets}
        // liveValidate
      >
        {externalMessage && <div><Message type={externalMessageType}>{externalMessage}</Message></div>}
        <ConnectionSettingsForm.Footer
          action={action}
          testConnection={testConnection}
          openConnectionFile={openConnectionFile}
        />
      </Form>
      {process.env.NODE_ENV !== 'production' &&
        <div>
          <blockquote> -- DEV ONLY -- </blockquote>
          <a onClick={() => location.reload()}>Realod webview</a>
          <Syntax code={formData} language='json' />
        </div>
      }
    </>
  );
};

ConnectionSettingsForm.Footer = ({ testConnection, action, openConnectionFile }) => (
  <footer style={{ paddingTop: '12px', paddingBottom: '18px', lineHeight: 1.7 }}>
    <Button bg="var(--vscode-list-highlightForeground)" type="submit">
      Save Connection
    </Button>
    <Button onClick={testConnection} float="right" type="button">
      Test Connection
    </Button>
    {!`${action || UIAction.REQUEST_CREATE_CONNECTION}`.toLowerCase().includes('create') && (
      <A onClick={openConnectionFile} float="right" style={{ marginRight: '2em' }}>
        Open settings
      </A>
    )}
  </footer>
);

const widgets: FormProps<any>['widgets'] = {
  FileWidget: FileWidget,
};

export default ConnectionSettingsForm;
