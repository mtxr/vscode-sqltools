import { TextEditor, TextEditorEdit, commands } from 'vscode';
import ConfigManager from '@sqltools/core/config-manager';
import { query as QueryUtils } from '@sqltools/core/utils';
import { EXT_NAME } from '@sqltools/core/constants';

function formatSql(editor: TextEditor, edit: TextEditorEdit): void {
  try {
    const indentSize: number = ConfigManager.format.indentSize;
    edit.replace(editor.selection, QueryUtils.format(editor.document.getText(editor.selection), indentSize));
    commands.executeCommand('revealLine', { lineNumber: editor.selection.active.line, at: 'center' });
  } catch (error) {
    console.error('Error formatting query.', error); // @TODO: User default extension error handler
  }
}

const register = () => {
  // @TODO: registerTextEditorCommand should be a method of the extension
  commands.registerTextEditorCommand(`${EXT_NAME}.formatSql`, formatSql);
}

export default { register };