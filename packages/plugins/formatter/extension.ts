import { createLogger } from '@sqltools/log/src';
import { TextEditor, TextEditorEdit, commands, SnippetString, env, workspace } from 'vscode';
import Config from '@sqltools/util/config-manager';
import { formatInsertQuery, format as queryFormat } from '@sqltools/util/query';
import { insertText, getOrCreateEditor } from '@sqltools/vscode/utils';
import { NSDatabase, IExtension } from '@sqltools/types';
import { SidebarItem } from '../connection-manager/explorer';
import { EXT_NAMESPACE } from '@sqltools/util/constants';

const log = createLogger('formatter');

function formatSqlHandler(editor: TextEditor, edit: TextEditorEdit) {
  try {
    const options = {
      ...Config.format,
      insertSpaces: workspace.getConfiguration().get<boolean>('editor.insertSpaces'),
      tabSize: workspace.getConfiguration().get<number>('editor.tabSize'),
    };
    edit.replace(editor.selection, queryFormat(editor.document.getText(editor.selection), options));
    commands.executeCommand('revealLine', { lineNumber: editor.selection.active.line, at: 'center' });
  } catch (error) {
    log.error('Error formatting query.', error);
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

function copyMessagesHandler(item: { value: string } | string, items?: ({ value: string } | string)[]) {
  items = items ? items : [item];
  const copyText = items.filter(n => n !== null && typeof n !== 'undefined').map(item => `${(<any>item).label || item} [${(<any>item).description}]`).join('\n');
  if (!copyText) return;
  return env.clipboard.writeText(copyText);
}

async function generateInsertQueryHandler(item: SidebarItem) {
  const columns: NSDatabase.IColumn[] = await commands.executeCommand(`${EXT_NAMESPACE}.getChildrenForTreeItem`, {
    conn: item.conn,
    item: item.metadata,
  });
  const insertQuery: string = await commands.executeCommand(`${EXT_NAMESPACE}.getInsertQuery`, {
    conn: item.conn,
    item: item.metadata,
    columns
  })
  return insertText(new SnippetString(formatInsertQuery(insertQuery, Config.format)));
}

function newSqlFileHandler() {
  return getOrCreateEditor(true);
}

const register = (extension: IExtension) => {
  extension.registerTextEditorCommand(`formatSql`, formatSqlHandler)
    .registerCommand(`insertText`, insertTextHandler)
    .registerCommand(`copyText`, copyTextHandler)
    .registerCommand(`copyMessages`, copyMessagesHandler)
    .registerCommand(`generateInsertQuery`, generateInsertQueryHandler)
    .registerCommand(`newSqlFile`, newSqlFileHandler);
}

export default { register, name: 'Formatter Plugin' };