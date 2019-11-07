import { workspace, Uri } from 'vscode';
import path from 'path';

const relativeToWorkspace = (file: string) => {
  const workspaceFolder = workspace.getWorkspaceFolder(Uri.file(file));
  const isSavedWorkSpace = !!(workspace.workspaceFile && workspace.workspaceFile.scheme !== 'untitled');
  if (isSavedWorkSpace && workspaceFolder) {
    // when using workspace files
    file = workspace.asRelativePath(file, false);
    file = `\${workspaceFolder:${workspaceFolder.name}}/${file}`;
  } else if (workspaceFolder && workspace.workspaceFolders.length === 1) {
    // when vscode opens a folder
    file = workspace.asRelativePath(file, false);
    file = `\${workspaceFolder}${path.sep}${file}`;
  }
  // if no folder is open or not saved workspace, just return
  return file;
}

export default relativeToWorkspace;