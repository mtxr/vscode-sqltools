import { RequestType } from 'vscode-languageserver-protocol';
import { NodeDependency } from '@sqltools/plugins/dependency-manager/interfaces';
export const InstallDepRequest = new RequestType<
  { deps: NodeDependency[] },
  void,
  Error,
  void
>('DependencyInstaller/install');

export const MissingModuleNotification = 'DependencyInstaller/missingModule';
export const DependeciesAreBeingInstalledNotification = 'DependencyInstaller/dependeciesAreBeingInstalledNotification';
export const ElectronNotSupportedNotification = 'DependencyInstaller/electronNotSupported';