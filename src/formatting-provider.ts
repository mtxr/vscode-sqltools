import {
  commands as VSCode,
  commands as VsCommands,
  Disposable,
  DocumentFormattingEditProvider,
  DocumentRangeFormattingEditProvider,
  ExtensionContext,
  FormattingOptions,
  languages as Languages,
  OutputChannel,
  Position,
  QuickPickItem,
  Range,
  Selection,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument,
  TextDocumentChangeEvent,
  TextEdit,
  TextEditor,
  TextEditorEdit,
  TextEditorSelectionChangeEvent,
  Uri,
  ViewColumn,
  window as Window,
  workspace as Workspace,
  WorkspaceConfiguration,
} from 'vscode';
import { BookmarksStorage, History, Logger, Utils } from './api';
import errorHandler from './error-handler';

export class SelectionFormatter implements DocumentRangeFormattingEditProvider {
  public provideDocumentRangeFormattingEdits(
    document: TextDocument, range: Range, formattingOptions: FormattingOptions,
  ): TextEdit[] {
    const text = document.getText(range);
    return [ TextEdit.replace(range, Utils.formatSql(text, formattingOptions.tabSize)) ];
  }
}
