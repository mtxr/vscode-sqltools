'use strict';

import {
    ExtensionContext,
    commands as Commands,
    window as Window
} from 'vscode';

import {
    Log,
    Logger,
    VERSION as API_VERSION
} from './api';

const VERSION             = '0.0.0';
const EXTENSION_NAMESPACE = 'sqltools';

Logger.setLogging(true);

export function activate(context: ExtensionContext) {

    let disposable = Commands.registerCommand(`${EXTENSION_NAMESPACE}.loaded`, () => {

        Window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}
