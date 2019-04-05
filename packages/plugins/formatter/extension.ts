import { TextEditor, TextEditorEdit, commands } from 'vscode';
import ConfigManager from '@sqltools/core/config-manager';
import { format } from './utils';
import { query as QueryUtils } from '@sqltools/core/utils';
import { insertText, insertSnippet, getOrCreateEditor } from '@sqltools/core/utils/vscode';
import SQLTools from '@sqltools/core/plugin-api';
import { DatabaseInterface } from '@sqltools/core/interface';

function formatSqlHandler(editor: TextEditor, edit: TextEditorEdit): void {
  try {
    edit.replace(editor.selection, format(editor.document.getText(editor.selection), ConfigManager.format));
    commands.executeCommand('revealLine', { lineNumber: editor.selection.active.line, at: 'center' });
  } catch (error) {
    console.error('Error formatting query.', error);
  }
}

function insertTextHandler(node: { value: string } | string) {
  if (!node) return;
  return insertText(typeof node === 'string' ? node : node.value);
}

function generateInsertQueryHandler(item: { columns: DatabaseInterface.TableColumn[], name?: string }): Promise<boolean> {
  return insertSnippet(QueryUtils.generateInsert(item.name || item.toString(), item.columns, ConfigManager.format));
}

function newSqlFileHandler() {
  return getOrCreateEditor(true);
}

const register = (extension: SQLTools.ExtensionInterface) => {
  extension.registerTextEditorCommand(`formatSql`, formatSqlHandler)
    .registerCommand(`insertText`, insertTextHandler)
    .registerCommand(`generateInsertQuery`, generateInsertQueryHandler)
    .registerCommand(`newSqlFile`, newSqlFileHandler);
}

export default { register };