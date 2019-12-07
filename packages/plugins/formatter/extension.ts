import logger from '@sqltools/vscode/log';
import { TextEditor, TextEditorEdit, commands, SnippetString, env } from 'vscode';
import ConfigManager from '@sqltools/core/config-manager';
import { format } from './utils';
import { query as QueryUtils } from '@sqltools/core/utils';
import { insertText, getOrCreateEditor } from '@sqltools/vscode/utils';
import { NSDatabase, IExtension } from '@sqltools/types';

const log = logger.extend('formatter');

function formatSqlHandler(editor: TextEditor, edit: TextEditorEdit) {
  try {
    edit.replace(editor.selection, format(editor.document.getText(editor.selection), ConfigManager.format));
    commands.executeCommand('revealLine', { lineNumber: editor.selection.active.line, at: 'center' });
  } catch (error) {
    log.extend('error')('Error formatting query.', error);
    return Promise.reject(error);
  }
}

function insertTextHandler(node: { value: string, snippet?: SnippetString } | string | SnippetString, nodes?: ({ value: string, snippet?: SnippetString } | string | SnippetString)[]) {
  nodes = nodes ? nodes : [node];
  const toInsertSnippet = new SnippetString();
  let tabStop = 1;
  nodes.forEach((node, index) => {
    if (!node) return;
    let toInsert = (<any>node).snippet || (<any>node).value || (<any>node);
    if (!(toInsert instanceof SnippetString)) {
      toInsertSnippet.appendPlaceholder(toInsert.toString(), tabStop++);
    } else {
      const value = toInsert.value.replace(/\$0/g, '').replace(/(\$\{)(\d+)(\:)?/g, (_, b, _x, a) => {
        return `${b}${tabStop++}${a}`;
      });
      toInsertSnippet.value += value;
      (<any>toInsertSnippet)._tabStop = tabStop;
    }
    if (index !== nodes.length - 1) {
      toInsertSnippet.appendText(', ');
    }
  });
  toInsertSnippet.appendTabstop(0);
  return insertText(toInsertSnippet);
}

function copyTextHandler(item: { value: string } | string, items?: ({ value: string } | string)[]) {
  items = items ? items : [item];
  const copyText = items.filter(n => n !== null && typeof n !== 'undefined').map(item => `${(<any>item).value || item}`).join(', ');
  if (!copyText) return;
  return env.clipboard.writeText(copyText);
}

function generateInsertQueryHandler(item: { columns: NSDatabase.IColumn[], name?: string }) {
  return insertText(new SnippetString(QueryUtils.generateInsert(item.name || item.toString(), item.columns, ConfigManager.format)));
}

function newSqlFileHandler() {
  return getOrCreateEditor(true);
}

const register = (extension: IExtension) => {
  extension.registerTextEditorCommand(`formatSql`, formatSqlHandler)
    .registerCommand(`insertText`, insertTextHandler)
    .registerCommand(`copyText`, copyTextHandler)
    .registerCommand(`generateInsertQuery`, generateInsertQueryHandler)
    .registerCommand(`newSqlFile`, newSqlFileHandler);
}

export default { register };