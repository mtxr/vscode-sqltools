import { FormattingOptions, Range, TextDocument, TextEdit } from 'vscode-languageserver';
import { Utils } from './api';

export class SelectionFormatter {
  public static handler(
    document: TextDocument, formattingOptions: FormattingOptions, range?: Range,
  ): TextEdit[] {
    let text;
    if (range) {
      text = document.getText().substring(document.offsetAt(range.start), document.offsetAt(range.end));
    } else {
      text = document.getText();
      range = { start: { line: 0, character: 0 }, end: { line: document.lineCount, character: 0 } };
    }

    return [ TextEdit.replace(range, Utils.formatSql(text, formattingOptions.tabSize)) ];
  }
}
