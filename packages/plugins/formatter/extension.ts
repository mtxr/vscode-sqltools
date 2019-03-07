import { TextEditor, TextEditorEdit, commands } from 'vscode';
import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME } from '@sqltools/core/constants';
import { format } from './utils';
import { query as QueryUtils } from '@sqltools/core/utils';
import { insertText, insertSnippet, getOrCreateEditor } from '@sqltools/extension/api/vscode-utils';
import { SQLToolsExtensionInterface } from '@sqltools/core/interface/plugin';

function formatSqlHandler(editor: TextEditor, edit: TextEditorEdit): void {
  try {
    const indentSize: number = ConfigManager.format.indentSize;
    edit.replace(editor.selection, format(editor.document.getText(editor.selection), indentSize));
    commands.executeCommand('revealLine', { lineNumber: editor.selection.active.line, at: 'center' });
  } catch (error) {
    console.error('Error formatting query.', error); // @TODO: User default extension error handler
  }
}

function insertTextHandler(node: { value: string } | string) {
  if (!node) return;
  return insertText(typeof node === 'string' ? node : node.value);
}

function generateInsertQueryHandler({ table, columns }: { table: string, columns: any }): Promise<boolean> {
  return insertSnippet(QueryUtils.generateInsert(table.toString(), columns, ConfigManager.format.indentSize));
}

function newSqlFileHandler() {
  return getOrCreateEditor(true);
}

const register = (extension: SQLToolsExtensionInterface) => {
  // @TODO: registerTextEditorCommand should be a method of the extension
  extension.context.subscriptions.push(
    commands.registerTextEditorCommand(`${EXT_NAME}.formatSql`, formatSqlHandler),
    commands.registerCommand(`${EXT_NAME}.insertText`, insertTextHandler),
    commands.registerCommand(`${EXT_NAME}.generateInsertQuery`, generateInsertQueryHandler),
    commands.registerCommand(`${EXT_NAME}.newSqlFile`, newSqlFileHandler),
  );
}

export default { register };