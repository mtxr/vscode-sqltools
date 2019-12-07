import { IConnection } from '@sqltools/types';
import { RequestType } from 'vscode-languageserver-protocol';

export const InstallDepRequest = new RequestType<
  { driver: IConnection['driver'] },
  void,
  Error,
  void
>('DependencyInstaller/install');

export const MissingModuleNotification = 'DependencyInstaller/missingModule';
export const DependeciesAreBeingInstalledNotification = 'DependencyInstaller/dependeciesAreBeingInstalledNotification';
export const ElectronNotSupportedNotification = 'DependencyInstaller/electronNotSupported';