import { Log, Logger } from './api/logger';
'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands as Commands, window as Window } from 'vscode';

const VERSION = '0.0.1';
const EXTENSION_NAMESPACE = 'sqltools';

Logger.setLogging(true);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    Log(`Congratulations, your extension "${EXTENSION_NAMESPACE} v${VERSION}" is now active!`);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = Commands.registerCommand(`${EXTENSION_NAMESPACE}.loaded`, () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        Window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
