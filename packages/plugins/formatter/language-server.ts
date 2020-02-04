import ConfigRO from '@sqltools/core/config-manager';
import * as Utils from '@sqltools/core/utils';
import { Disposable, DocumentFormattingParams, DocumentRangeFormattingParams, DocumentRangeFormattingRequest, Range, TextEdit } from 'vscode-languageserver';
import { format } from '@sqltools/core/utils/query';
import telemetry from '@sqltools/language-server/telemetry';
import { ILanguageServerPlugin, ILanguageServer } from '@sqltools/types';

export default class FormatterPlugin implements ILanguageServerPlugin {
  private server: ILanguageServer<any>;
  private formatterLanguages: string[] = [];
  private  formatterRegistration: Thenable<Disposable> | null = null;

  private handler = (params: DocumentRangeFormattingParams | DocumentFormattingParams | DocumentRangeFormattingParams[]): TextEdit[] => {
    try {
      if (Array.isArray(params)) {
        params = params[0];
      }
      const { textDocument, range } = params as DocumentRangeFormattingParams;
      const document = this.server.docManager.get(textDocument.uri);
      let text: string;
      let newRange: Range;
      if (range) {
        text = document.getText().substring(document.offsetAt(range.start), document.offsetAt(range.end));
      } else {
        text = document.getText();
        newRange = { start: { line: 0, character: 0 }, end: { line: document.lineCount, character: 0 } };
      }

      return [ TextEdit.replace(newRange || range, format(text, ConfigRO.format)) ];
    } catch (e) {
      telemetry.registerException(e);
    }
  }

  register(server: ILanguageServer<any>) {
    this.server = server;
    this.server.addOnDidChangeConfigurationHooks(this.onDidChangeConfiguration);
    this.server.onDocumentFormatting(this.handler);
    this.server.onDocumentRangeFormatting(this.handler);
  }

  private onDidChangeConfiguration = async () => {
    const oldLang = this.formatterLanguages.sort(Utils.sortText);
    const newLang = ConfigRO.formatLanguages.sort(Utils.sortText);
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