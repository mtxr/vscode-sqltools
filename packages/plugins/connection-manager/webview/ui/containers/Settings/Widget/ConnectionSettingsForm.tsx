import React from 'react';
import DriverIcon from '../../../components/DriverIcon';
import Button from '../../../components/Button';
import { SettingsScreenState } from '../interfaces';
import Form, { FormProps } from '@rjsf/core';
import { IConnection } from '@sqltools/types';
import Syntax from '../../../components/Syntax';
import FileWidget from './FileWidget';
import { UIAction } from '../../../../../actions';
import Message from '../../../components/Message';
import style from './ConnectionSettingsForm.m.scss';

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
    <div className={style.formContainer}>
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
        showErrorList={false}
        noHtml5Validate={true}
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
    </div>
  );
};

ConnectionSettingsForm.Footer = ({ testConnection, action, openConnectionFile }) => (
  <footer className={style.footer}>
    <Button bg="var(--vscode-list-highlightForeground)" type="submit">
      Save Connection
    </Button>
    <Button onClick={testConnection} float="right" type="button">
      Test Connection
    </Button>
    {!`${action || UIAction.REQUEST_CREATE_CONNECTION}`.toLowerCase().includes('create') && (
      <a onClick={openConnectionFile}>
        Open settings
      </a>
    )}
  </footer>
);

const widgets: FormProps<any>['widgets'] = {
  FileWidget: FileWidget,
};

export default ConnectionSettingsForm;
