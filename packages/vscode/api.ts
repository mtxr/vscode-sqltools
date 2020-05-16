import { IExtension } from '@sqltools/types';
import vscode from 'vscode';
export async function getSQLToolsAPI() {
  const sqltools = vscode.extensions.getExtension('mtxr.sqltoolspreview') || vscode.extensions.getExtension('mtxr.sqltools');
  if (!sqltools) {
    return;
  }

  await sqltools.activate();

  return sqltools.exports as IExtension;
}