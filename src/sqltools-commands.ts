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
import { Logger, Storage, Utils } from './api';
import Constants from './constants';
import LogWriter from './log-writer';

const output = new LogWriter();
const config: WorkspaceConfiguration = Workspace.getConfiguration(Constants.extNamespace.toLocaleLowerCase());
const logger = Logger.instance(output)
  .setPackageName(Constants.extNamespace)
  .setPackageVersion(Constants.version)
  .setLevel(Logger.levels[config.get('log_level', 'DEBUG')])
  .setLogging(config.get('logging', false));

const queries: Storage = new Storage();

function formatSql(editor: TextEditor, edit: TextEditorEdit): any {
  try {
    edit.replace(editor.selection, Utils.formatSql(editor.document.getText(editor.selection)));
    VsCommands.executeCommand('revealLine', { lineNumber: editor.selection.active.line, at: 'center' });
    logger.debug('Query formatted!');
  } catch (error) {
    logger.error('Error formating query', error);
    Window.showErrorMessage('Error formatting query' + error.toString());
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

function saveQuery(editor: TextEditor, edit: TextEditorEdit): void {
  try {
    const query = editor.document.getText(editor.selection);
    Window.showInputBox({ prompt: 'Query name' })
      .then((val) => queries.add(val, query));
  } catch (error) {
    logger.error('Error saving query: ', error);
    Window.showErrorMessage('Error saving query. Check SQLTools logs for more information.');
  }
}

function showSavedQueries(): Thenable < QuickPickItem > {
  const all: Object = queries.all();
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

function deleteSavedQuery(): void {
  showSavedQueries()
    .then((toDelete) => {
      if (!toDelete) return;
      queries.delete(toDelete.label);
    });
}

function deleteAllSavedQueries(): void {
  queries.clear();
}

function editSavedQuery(): void {
  showSavedQueries()
    .then((query) => {
      if (!query) return;
      logger.debug(`Selected query ${query.label}`);

      const editingBufferName = `${Constants.bufferName}`;
      Workspace.openTextDocument(Uri.parse(`untitled:${editingBufferName}`)).then((document: TextDocument) => {
        Window.showTextDocument(document, 1, false).then((editor) => {
          editor.edit((edit) => {
            const headerText = ''.replace('{queryName}', query.label);
            edit.insert(new Position(0, 0), `${headerText}${query.detail}`);
          });
        });
      }, (error: any) => {
        Window.showErrorMessage('No query selected');
      });
    }, (error) => {
      logger.error(error.toString());
    });
}

function showOutputChannel(): void {
  output.showOutput();
}

export const ST = {
  formatSql,
  selectConnection,
  showRecords,
  describeTable,
  describeFunction,
  executeQuery,
  aboutVersion,
  showHistory,
  saveQuery,
  deleteSavedQuery,
  deleteAllSavedQueries,
  editSavedQuery,
  showOutputChannel,
};
