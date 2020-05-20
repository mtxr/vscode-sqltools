import React from 'react';
import DriverIcon from '../../../components/DriverIcon';
import Button from '../../../components/Button';
import A from '../../../components/A';
import { SettingsScreenState } from '../interfaces';
import Form, { FormProps } from '@rjsf/core';
import { IConnection } from '@sqltools/types';

const ConnectionSettingsForm = ({
  onSubmit,
  testConnection,
  openConnectionFile,
  schema = {},
  uiSchema = {},
  driver,
  action,
  errors,
}: {
  onSubmit: FormProps<any>['onSubmit'];
  testConnection: () => void;
  openConnectionFile: () => void;
  schema: FormProps<IConnection>['schema'];
  uiSchema: FormProps<IConnection>['uiSchema'];
  driver: SettingsScreenState['driver'];
  action: SettingsScreenState['action'];
  errors: SettingsScreenState['errors'];
  installedDrivers: SettingsScreenState['installedDrivers'];
}) => {
  return (
    <>
      <h5>Connection Settings</h5>
      <hr />
      <DriverIcon driver={driver} />
      <Form schema={schema} uiSchema={uiSchema} onSubmit={onSubmit} />
      <ConnectionSettingsForm.Footer
        errors={errors}
        action={action}
        testConnection={testConnection}
        openConnectionFile={openConnectionFile}
      />
    </>
  );
};

ConnectionSettingsForm.Footer = ({ errors, testConnection, action, openConnectionFile }) => (
  <footer style={{ paddingTop: '12px', paddingBottom: '18px', lineHeight: 1.7 }}>
    <Button bg="var(--vscode-list-highlightForeground)" type="submit" disabled={Object.keys(errors).length > 0}>
      Save Connection
    </Button>
    <Button disabled={Object.keys(errors).length > 0} onClick={testConnection} float="right" type="button">
      Test Connection
    </Button>
    {!`${action || 'create'}`.startsWith('create') && Object.keys(errors).length === 0 && (
      <A onClick={openConnectionFile} float="right" style={{ marginRight: '2em' }}>
        Open settings
      </A>
    )}
  </footer>
);

export default ConnectionSettingsForm;
