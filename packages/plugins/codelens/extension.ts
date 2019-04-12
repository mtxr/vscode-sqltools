import SQLTools from '@sqltools/core/plugin-api';
import { languages, Disposable } from 'vscode';
import SQLToolsCodeLensProvider from './provider';
import ConfigManager from '@sqltools/core/config-manager';
import * as Utils from '@sqltools/core/utils';

export default class CodeLensPlugin implements SQLTools.ExtensionPlugin {
  private codelensDisposable: Disposable;
  private registeredLanguages: string[] = [];
  dispose() {
    if (!this.codelensDisposable) return;
    this.codelensDisposable.dispose();
    this.codelensDisposable = null;
  }

  createCodelens() {
    const oldLang = this.registeredLanguages.sort(Utils.sortText);
    const newLang = ConfigManager.codelensLanguages.sort(Utils.sortText);
    const shouldRegister = newLang.length > 0 && (oldLang.join() !== newLang.join());

    if (!shouldRegister) return;

    if(this.registeredLanguages) {
      this.dispose();
    }
    this.codelensDisposable = languages.registerCodeLensProvider(
      ConfigManager.codelensLanguages.map(language => ({ language })),
      new SQLToolsCodeLensProvider(),
    );
    this.registeredLanguages = ConfigManager.codelensLanguages;
  }

  register(extension: SQLTools.ExtensionInterface) {
    extension.context.subscriptions.push(this);
  }
}