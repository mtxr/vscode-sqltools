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

const config: WorkspaceConfiguration = Workspace.getConfiguration('sqltools');
const debug: boolean = config.get('debug', false);
const queries: Storage = new Storage();

Logger.setPackageName(Constants.extNamespace);
Logger.setPackageVersion(Constants.version);
Logger.setLogging(debug);
const logger = Logger.instance();

function formatSql(editor: TextEditor, edit: TextEditorEdit): any {
  try {
    edit.replace(editor.selection, Utils.formatSql(editor.document.getText(editor.selection)));
    const position = editor.selection.active;

    const newPosition = position.with(position.line, 0);
    const newSelection = new Selection(newPosition, newPosition);
    editor.selection = newSelection;
  } catch (error) {
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
  Window.showInformationMessage(`Using SQLTools ${Constants.version}`);
}

// tslint:disable-next-line:no-empty
function showHistory() {}

function saveQuery(editor: TextEditor, edit: TextEditorEdit): void {
  try {
    const query = editor.document.getText(editor.selection);
    Window.showInputBox({ prompt: 'Query name' })
      .then((val) => queries.add(val, query));
  } catch (error) {
    Window.showErrorMessage('Error saving query');
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
};
