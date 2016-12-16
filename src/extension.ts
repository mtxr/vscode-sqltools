'use strict';

import {
    ExtensionContext,
    commands as Commands,
    window as Window,
    TextEditor, 
    TextEditorEdit
} from 'vscode';

import {
    Log,
    Logger,
    formatSql as Format,
    VERSION as API_VERSION
} from './api';

const VERSION             = '0.0.1';
const EXTENSION_NAMESPACE = 'sqltools';

Logger.setPackageName(EXTENSION_NAMESPACE);
Logger.setPackageVersion(VERSION);
Logger.setLogging(true);

export function activate(context: ExtensionContext) {

    let disposable = Commands.registerTextEditorCommand(`${EXTENSION_NAMESPACE}.formatSql`, (editor: TextEditor, edit: TextEditorEdit) => {
        try {
            let sel = editor.selection;
            let document = editor.document;
            edit.replace(sel, Format(document.getText(sel)))
            
        } catch (error) {
            console.log(error)
        }
        Window.showInformationMessage('Query formatted!');
    });

    context.subscriptions.push(disposable);
}
