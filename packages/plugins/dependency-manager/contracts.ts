import { ConnectionInterface } from '@sqltools/core/interface';
import { RequestType } from 'vscode-languageserver';

export const InstallDep = new RequestType<
  { dialect: ConnectionInterface['dialect'] },
  void,
  Error,
  void
>('DependencyInstaller/install');