import logger from '@sqltools/core/log/vscode';
import { TextEditor, TextEditorEdit, commands, SnippetString } from 'vscode';
import ConfigManager from '@sqltools/core/config-manager';
import { format } from './utils';
import { query as QueryUtils } from '@sqltools/core/utils';
import { insertText, getOrCreateEditor } from '@sqltools/core/utils/vscode';
import SQLTools, { DatabaseInterface } from '@sqltools/core/plugin-api';

function formatSqlHandler(editor: TextEditor, edit: TextEditorEdit): void {
  try {
    edit.replace(editor.selection, format(editor.document.getText(editor.selection), ConfigManager.format));
    commands.executeCommand('revealLine', { lineNumber: editor.selection.active.line, at: 'center' });
  } catch (error) {
    logger.error('Error formatting query.', error);
  }
}

function insertTextHandler(node: { value: string, snippet?: SnippetString } | string | SnippetString) {
  if (!node) return;
  if (typeof node === 'string' || node instanceof SnippetString) {
    return insertText(node);
  }
  return insertText(node.snippet || node.value);
}

function generateInsertQueryHandler(item: { columns: DatabaseInterface.TableColumn[], name?: string }) {
  return insertText(new SnippetString(QueryUtils.generateInsert(item.name || item.toString(), item.columns, ConfigManager.format)));
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