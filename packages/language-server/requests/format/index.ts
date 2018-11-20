import {
  DocumentFormattingParams,
  DocumentRangeFormattingParams,
  FormattingOptions,
  Range,
  TextDocument,
  TextDocuments,
  TextEdit,
} from 'vscode-languageserver';
import Logger from 'utils/logger';
import * as Utils from '@sqltools/core/utils';

export default function handler(
  docManager: TextDocuments,
  params: DocumentRangeFormattingParams | DocumentFormattingParams | DocumentRangeFormattingParams[],
): TextEdit[] {
  try {
    if (Array.isArray(params)) {
      params = params[0];
    }
    const { textDocument, options, range } = params as DocumentRangeFormattingParams;
    return format(docManager.get(textDocument.uri), options, range);
  } catch (e) {
    Logger.error(e);
    throw e;
  }
}

function format(
  document: TextDocument, formattingOptions: FormattingOptions, range?: Range,
): TextEdit[] {
  let text;
  if (range) {
    text = document.getText().substring(document.offsetAt(range.start), document.offsetAt(range.end));
  } else {
    text = document.getText();
    range = { start: { line: 0, character: 0 }, end: { line: document.lineCount, character: 0 } };
  }

  return [ TextEdit.replace(range, Utils.query.format(text, formattingOptions.tabSize)) ];
}
