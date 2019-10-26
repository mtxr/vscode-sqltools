import { ConnectionInterface } from '@sqltools/core/interface';
import { RequestType } from 'vscode-languageserver-protocol';

export const InstallDepRequest = new RequestType<
  { driver: ConnectionInterface['driver'] },
  void,
  Error,
  void
>('DependencyInstaller/install');

export const MissingModuleNotification = 'DependencyInstaller/missingModule';
export const DependeciesAreBeingInstalledNotification = 'DependencyInstaller/dependeciesAreBeingInstalledNotification';
export const ElectronNotSupportedNotification = 'DependencyInstaller/electronNotSupported';