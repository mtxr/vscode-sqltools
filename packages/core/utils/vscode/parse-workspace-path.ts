import { workspace } from 'vscode';

const WORKSPACE_PLACEHOLDER = /\$\{workspaceFolder(?:\:(.+))?}/;

const parseWorkspacePath = (file: string) => {
  if (!WORKSPACE_PLACEHOLDER.test(file)) return file;
  const [ _, workspaceName ] = file.match(WORKSPACE_PLACEHOLDER) || [];
  if (workspaceName) {
    const workspacePath = (workspace.workspaceFolders.find(w => w.name === workspaceName) || { uri: { fsPath: '.' } }).uri.fsPath;
    file = file.replace(WORKSPACE_PLACEHOLDER, `${workspacePath}`);
  } else {
    file = file.replace(WORKSPACE_PLACEHOLDER, `.`)
  }
  return file;
}

export default parseWorkspacePath;