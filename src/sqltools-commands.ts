import { Storage } from './api/storage';
import {
    window as Window,
    TextEditor,
    TextEditorEdit,
    TextDocument,
    workspace as Workspace,
    WorkspaceConfiguration,
    QuickPickItem,
    commands as VsCommands,
    Uri,
    Position
    
} from 'vscode';

import * as Path from 'path';
import * as api from './api';
import {
    bufferName,
    extensionNamespace,
    version
} from './constants';

const config: WorkspaceConfiguration = Workspace.getConfiguration('sqltools');
const debug:  boolean                = config.get('debug', false);
let queries:  Storage                = new api.Storage();

api.Logger.setPackageName(extensionNamespace);
api.Logger.setPackageVersion(version);
api.Logger.setLogging(debug);

function formatSql(editor: TextEditor, edit: TextEditorEdit): any {
    try {
        edit.replace(editor.selection, api.formatSql(editor.document.getText(editor.selection)));
    } catch (error) {
        Window.showErrorMessage('Error formatting query');
    }
}

function showConnectionMenu() {}

function selectConnection() {}

function showRecords() {}

function describeTable() {}

function describeFunction() {}

function executeQuery() {}

function aboutVersion(): void {
    Window.showInformationMessage(`Using SQLTools ${version}`);
}

function showHistory() {}

function saveQuery(editor: TextEditor, edit: TextEditorEdit): void {
    try {
        let query = editor.document.getText(editor.selection);
        Window.showInputBox({prompt: 'Query name'})
            .then(val => queries.add(val, query))
    } catch (error) {
        Window.showErrorMessage('Error saving query');
    }
}

function showSavedQueries():Thenable<QuickPickItem> {
    let all = queries.all();
    let options: QuickPickItem[] = [];

    for (let key in all) {
        options.push({
            description: '',
            detail: all[key],
            label: key
        });
    }
    return Window.showQuickPick(options);
}

function deleteSavedQuery(): void {
    showSavedQueries()
        .then(toDelete => {
            if (!toDelete) return;
            queries.delete(toDelete.label);
        });
}

function editSavedQuery(): void {
    showSavedQueries()
        .then(query => {
            if (!query) {
                return;
            }

            Workspace.openTextDocument(Uri.parse(`untitled:${bufferName}`)).then((document: TextDocument) => {
                Window.showTextDocument(document, 1, false).then(editor => {
                    editor.edit(edit => {
                        edit.insert(new Position(0, 0), `${query.detail}\n\n`);
                    });
                });
            }, (error: any) => {
                Window.showErrorMessage('No query selected');
            });
        });
}

export {
    api,
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
    editSavedQuery
}
