import { languages, Disposable, window, workspace, TextEditor } from 'vscode';
import SQLToolsCodeLensProvider from './provider';
import ConfigManager from '@sqltools/core/config-manager';
import * as Utils from '@sqltools/core/utils';
import { IExtensionPlugin, IExtension } from '@sqltools/types';
import { EXT_NAME } from '@sqltools/core/constants';
import { getEditorQueryDetails } from '@sqltools/vscode/utils/query';

export default class CodeLensPlugin implements IExtensionPlugin {
  private codelensDisposable: Disposable;
  private registeredLanguages: string[] = [];
  private provider: SQLToolsCodeLensProvider;
  async dispose() {
    if (!this.codelensDisposable) return;
    await this.codelensDisposable.dispose();
    this.codelensDisposable = null;
  }

  async createCodelens(context: IExtension['context']) {
    const oldLang = this.registeredLanguages.sort(Utils.sortText);
    const newLang = ConfigManager.codelensLanguages.sort(Utils.sortText);
    const shouldRegister = newLang.length > 0 && (oldLang.join() !== newLang.join());

    if (!shouldRegister) return;

    if(this.registeredLanguages) {
      await this.dispose();
    }
    this.provider = new SQLToolsCodeLensProvider(context);
    this.codelensDisposable = languages.registerCodeLensProvider(
      ConfigManager.codelensLanguages.map(language => ({ language })),
      this.provider,
    );
    this.registeredLanguages = ConfigManager.codelensLanguages;
  }

  createDecorations(context: IExtension['context']) {
    window.onDidChangeActiveTextEditor(editor => {
      updateDecorations(editor);
    }, null, context.subscriptions);

    workspace.onDidChangeTextDocument(event => {
      if (window.activeTextEditor && event.document === window.activeTextEditor.document) {
        updateDecorations(window.activeTextEditor);
      }
    }, null, context.subscriptions);
    window.onDidChangeTextEditorSelection(event => {
      if (event.textEditor && event.textEditor.document === window.activeTextEditor.document) {
        updateDecorations(window.activeTextEditor);
      }
    }, null, context.subscriptions);
    updateDecorations(window.activeTextEditor);
  }

  register(extension: IExtension) {
    extension.context.subscriptions.push(this);
    this.createCodelens(extension.context);
    this.createDecorations(extension.context);
    ConfigManager.addOnUpdateHook(() => {
      this.createCodelens(extension.context);
    });
  }

  reset() {
    return this.provider.reset();
  }
}

function updateDecorations(editor: TextEditor) {
  if (!editor || !editor.document || editor.document.uri.scheme === 'output') {
    return;
  }
  try {
    editor.setDecorations(currentQueryDecoration, []);
    const { range } = getEditorQueryDetails(editor);
    const decoration = { range };

    editor.setDecorations(currentQueryDecoration, [decoration]);
  } catch (error) {
    console.log(error);
  }
}

const currentQueryDecoration = window.createTextEditorDecorationType({
  backgroundColor: { id: `${EXT_NAME}.currentQueryBg` },
  borderColor: { id: `${EXT_NAME}.currentQueryOutline` },
  borderWidth: '1px',
  borderStyle: 'solid',
});