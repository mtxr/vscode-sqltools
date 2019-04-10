import SQLTools from '@sqltools/core/plugin-api';
import { languages } from 'vscode';
import SQLToolsCodeLensProvider from './provider';

export default class CodeLensPlugin implements SQLTools.ExtensionPlugin {
  register(extension: SQLTools.ExtensionInterface) {
    const codeLensDisposable = languages.registerCodeLensProvider(
      { language: 'sql' },
      new SQLToolsCodeLensProvider()
    )
    extension.context.subscriptions.push(codeLensDisposable);
  }
}