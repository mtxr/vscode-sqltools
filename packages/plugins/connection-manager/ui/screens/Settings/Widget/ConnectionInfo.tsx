import React from 'react';
import DriverIcon from '../../../components/DriverIcon';
import Button from '../../../components/Button';
import A from '../../../components/A';
import { SettingsScreenState } from '../interfaces';

const ConnectionInfo = ({
  submit,
  testConnection,
  openConnectionFile,
  driver,
  action,
  errors,
}: {
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
  testConnection: () => void;
  openConnectionFile: () => void;
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
      <form onSubmit={submit}>
        <ConnectionInfo.Footer
          errors={errors}
          action={action}
          testConnection={testConnection}
          openConnectionFile={openConnectionFile}
        />
      </form>
    </>
  );
};

ConnectionInfo.Footer = ({ errors, testConnection, action, openConnectionFile }) => (
  <div style={{ paddingTop: '12px', paddingBottom: '18px', lineHeight: 1.7 }}>
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
  </div>
);

export default ConnectionInfo;
