import { Uri } from 'vscode';
import Context from '@sqltools/vscode/context';

const keyName = 'attachedFilesMap';
export const getAttachedConnection = (file: Uri | string) => {
  return Context.workspaceState.get(keyName, {})[file.toString()];
};

export const removeAttachedConnection = (file: Uri | string) => {
  const map = Context.workspaceState.get(keyName, {});

  delete map[file.toString()];
  return Context.workspaceState.update(keyName, map);
};

export const attachConnection = (file: Uri | string, connId) => {
  const map = Context.workspaceState.get(keyName, {});

  map[file.toString()] = connId;

  return Context.workspaceState.update(keyName, map);
};
