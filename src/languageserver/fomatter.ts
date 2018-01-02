import { DocumentFormattingParams, DocumentRangeFormattingParams, TextEdit } from 'vscode-languageclient';
import { TextDocuments } from 'vscode-languageserver';
import { SelectionFormatter } from './../formatting-provider';
import Logger from './logger';

export function handler(
  docManager: TextDocuments,
  params: DocumentRangeFormattingParams | DocumentFormattingParams | DocumentRangeFormattingParams[],
): TextEdit[] {
  try {
    if (Array.isArray(params)) {
      params = params[0];
    }
    const { textDocument, options, range } = params as DocumentRangeFormattingParams;
    return SelectionFormatter.handler(docManager.get(textDocument.uri), options, range);
  } catch (e) {
    Logger.error(e);
    throw e;
  }
}
