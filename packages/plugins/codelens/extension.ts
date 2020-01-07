import { languages, Disposable } from 'vscode';
import SQLToolsCodeLensProvider from './provider';
import ConfigManager from '@sqltools/core/config-manager';
import * as Utils from '@sqltools/core/utils';
import { IExtensionPlugin } from '@sqltools/types';
import Context from '@sqltools/vscode/context';

export default class CodeLensPlugin implements IExtensionPlugin {
  private codelensDisposable: Disposable;
  private registeredLanguages: string[] = [];
  private provider: SQLToolsCodeLensProvider;
  async dispose() {
    if (!this.codelensDisposable) return;
    await this.codelensDisposable.dispose();
    this.codelensDisposable = null;
  }

  async createCodelens() {
    const oldLang = this.registeredLanguages.sort(Utils.sortText);
    const newLang = ConfigManager.codelensLanguages.sort(Utils.sortText);
    const shouldRegister = newLang.length > 0 && (oldLang.join() !== newLang.join());

    if (!shouldRegister) return;

    if(this.codelensDisposable) {
      await this.dispose();
    }
    this.provider = new SQLToolsCodeLensProvider();
    this.codelensDisposable = languages.registerCodeLensProvider(
      ConfigManager.codelensLanguages.map(language => ({ language })),
      this.provider,
    );
    this.registeredLanguages = ConfigManager.codelensLanguages;
  }

  register() {
    Context.subscriptions.push(this);
    this.createCodelens();
    ConfigManager.addOnUpdateHook(() => {
      this.createCodelens();
    });
  }

  reset() {
    return this.provider.reset();
  }
}