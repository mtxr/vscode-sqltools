import { LanguageServerPlugin, SQLToolsLanguageServerInterface } from '@sqltools/core/interface/plugin';
import { Disposable, DocumentRangeFormattingRequest } from 'vscode-languageserver';
import requestHandler from './request-handler';
import ConfigManager from '@sqltools/core/config-manager';
import * as Utils from '@sqltools/core/utils';

export default class FormatterPlugin implements LanguageServerPlugin {
  private server: SQLToolsLanguageServerInterface;
  private formatterLanguages: string[] = [];
  private  formatterRegistration: Thenable<Disposable> | null = null;

  register(server: SQLToolsLanguageServerInterface) {
    this.server = server;
    this.server.addOnDidChangeConfigurationHooks(this.onDidChangeConfiguration);
    this.server.onDocumentFormatting((params) => requestHandler(this.server.docManager, params));
    this.server.onDocumentRangeFormatting((params) => requestHandler(this.server.docManager, params));
  }

  private onDidChangeConfiguration = async () => {
    const oldLang = this.formatterLanguages.sort(Utils.sortText);
    const newLang = ConfigManager.formatLanguages.sort(Utils.sortText);
    const register = newLang.length > 0 && (!this.formatterRegistration || oldLang.join() !== newLang.join());
    if (register) {
      this.formatterLanguages = newLang.reduce((agg, language) => {
        if (typeof language === 'string') {
          agg.push({ language, scheme: 'untitled' });
          agg.push({ language, scheme: 'file' });
        } else {
          agg.push(language);
        }
        return agg;
      }, []);
      if (this.formatterRegistration) (await this.formatterRegistration).dispose();
      this.formatterRegistration = this.server.client.register(DocumentRangeFormattingRequest.type, {
        documentSelector: this.formatterLanguages,
      }).then((a) => a, error => this.server.notifyError('formatterRegistration error', error));
    } else if (this.formatterRegistration) {
      (await this.formatterRegistration).dispose();
    }
  }
}