// tslint:disable:no-reference
/// <reference path="./../node_modules/@types/node/index.d.ts" />

import * as Path from 'path';
import {
  commands as VsCommands,
  Position,
  QuickPickItem,
  Selection,
  TextDocument,
  TextEditor,
  TextEditorEdit,
  Uri,
  window as Window,
  workspace as Workspace,
  WorkspaceConfiguration,
} from 'vscode';
import { BookmarksStorage, Logger, Utils } from './api';
import Constants from './constants';
import LogWriter from './log-writer';

const output = new LogWriter();
const config: WorkspaceConfiguration = Workspace.getConfiguration(Constants.extNamespace.toLocaleLowerCase());
const logger = Logger.instance(output)
  .setPackageName(Constants.extNamespace)
  .setPackageVersion(Constants.version)
  .setLevel(Logger.levels[config.get('log_level', 'DEBUG')])
  .setLogging(config.get('logging', false));

const bookmarks: BookmarksStorage = new BookmarksStorage();

function formatSql(editor: TextEditor, edit: TextEditorEdit): void {
  try {
    edit.replace(editor.selection, Utils.formatSql(editor.document.getText(editor.selection)));
    VsCommands.executeCommand('revealLine', { lineNumber: editor.selection.active.line, at: 'center' });
    logger.debug('Query formatted!');
  } catch (error) {
    logger.error('Error formating query', error);
    errorHandler('Error formatting query.');
  }
}

// tslint:disable-next-line:no-empty
function showConnectionMenu() {}

// tslint:disable-next-line:no-empty
function selectConnection() {}

// tslint:disable-next-line:no-empty
function showRecords() {}

// tslint:disable-next-line:no-empty
function describeTable() {}

// tslint:disable-next-line:no-empty
function describeFunction() {}

// tslint:disable-next-line:no-empty
function executeQuery() {}

function aboutVersion(): void {
  const message = `Using SQLTools ${Constants.version}`;
  logger.info(message);
  Window.showInformationMessage(message);
}

// tslint:disable-next-line:no-empty
function showHistory() {}

function bookmarkSelection(editor: TextEditor, edit: TextEditorEdit) {
  try {
    const query = editor.document.getText(editor.selection);
    if (!query || query.length === 0) {
      return Window.showInformationMessage('Can\'t bookmark. You have selected nothing.');
    }
    Window.showInputBox({ prompt: 'Query name' })
      .then((name) => {
        if (!name || name.length === 0) {
          return Window.showInformationMessage('Can\'t bookmark. Name not provided.');
        }
        bookmarks.add(name, query);
        logger.debug(`Bookmarked query named '${name}'`);
      });
  } catch (error) {
    logger.error('Error bookmarking query: ', error);
    errorHandler('Error bookmarking query.');
  }
}

function showBookmarks(): Thenable < QuickPickItem > {
  const all: Object = bookmarks.all();
  const options: QuickPickItem[] = [];

  Object.keys(all).forEach((key) => {
    options.push({
      description: '',
      detail: all[key],
      label: key,
    });
  });
  return Window.showQuickPick(options);
}

function deleteBookmark(): void {
  showBookmarks()
    .then((toDelete) => {
      if (!toDelete) return;
      bookmarks.delete(toDelete.label);
      logger.debug(`Bookmarked query '${toDelete.label}' deleted!`);
    });
}

function clearBookmarks(): void {
  bookmarks.clear();
  logger.debug(`Bookmark cleared!`);
}

function editBookmark(): void {
  showBookmarks()
    .then((query) => {
      if (!query) return;
      logger.debug(`Selected bookmarked query ${query.label}`);

      const editingBufferName = `${Constants.bufferName}`;
      Workspace.openTextDocument(Uri.parse(`untitled:${editingBufferName}`)).then((document: TextDocument) => {
        Window.showTextDocument(document, 1, false).then((editor) => {
          editor.edit((edit) => {
            const headerText = ''.replace('{queryName}', query.label);
            edit.insert(new Position(0, 0), `${headerText}${query.detail}`);
          });
        });
      }, (error: any) => {
        logger.error('Unexpected error: ', error);
        errorHandler('Ops, we\'ve got an error!');
      });
    }, (error) => {
      logger.error('Unexpected error: ', error);
      errorHandler('Ops, we\'ve got an error!');
    });
}

function showOutputChannel(): void {
  output.showOutput();
}

function errorHandler(message) {
  return Window.showErrorMessage(`${message} Would you like to see the logs?`, 'Yes', 'No')
    .then((res) => {
      if (res === 'Yes') {
        showOutputChannel();
      }
      return res;
    });
}

export const ST = {
  /**
   * TextEditor commands
   */
  textEditor: {
    formatSql,
    executeQuery,
    bookmarkSelection,

  },
  /**
   * General commands
   */
  workspace: {
    selectConnection,
    showRecords,
    describeTable,
    describeFunction,
    aboutVersion,
    showHistory,
    deleteBookmark,
    clearBookmarks,
    editBookmark,
    showOutputChannel,
  },
};
