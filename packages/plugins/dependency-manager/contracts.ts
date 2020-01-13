import { RequestType } from 'vscode-languageserver-protocol';
import { NodeDependency } from '@sqltools/types';
export const InstallDepRequest = new RequestType<
  { deps: NodeDependency[] },
  void,
  Error,
  void
>('DependencyInstaller/install');

export const DependeciesAreBeingInstalledNotification = 'DependencyInstaller/dependeciesAreBeingInstalledNotification';