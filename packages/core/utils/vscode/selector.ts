// Reference: https://raw.githubusercontent.com/Huachao/vscode-restclient/master/src/utils/selector.ts

import { EOL } from 'os';
import { Range, TextEditor } from 'vscode';
import * as Constants from '@sqltools/core/constants';

export default class Selector {
  public static getQueryText(editor: TextEditor, range: Range = null): string {
    if (!editor || !editor.document) {
      return null;
    }

    let selectedText: string;
    if (editor.selection.isEmpty || range) {
      let activeLine = !range ? editor.selection.active.line : range.start.line;
      selectedText = Selector.getDelimitedText(editor.document.getText(), activeLine);
    } else {
      selectedText = editor.document.getText(editor.selection);
    }

    return selectedText;
  }

  public static getQueryRanges(lines: string[]): [number, number][] {
    let requestRanges: [number, number][] = [];
    const delimitedLines = Selector.getDelimiterRows(lines);

    requestRanges = delimitedLines.reduce((result, startLine, index) => {
      result.push([startLine, delimitedLines[index + 1] ? delimitedLines[index + 1] - 1 : lines.length]);
      return result;
    }, []);

    return requestRanges;
  }

  public static getRequestVariableDefinitionName(text: string): string {
    const matched = text.match(Constants.RequestVariableDefinitionRegex);
    return matched && matched[1];
  }

  public static isVariableDefinitionLine(line: string): boolean {
    return Constants.FileVariableDefinitionRegex.test(line);
  }

  private static getDelimitedText(fullText: string, currentLine: number): string {
    let lines: string[] = fullText.split(Constants.LineSplitterRegex);
    let delimiterLineNumbers: number[] = Selector.getDelimiterRows(lines);
    if (delimiterLineNumbers.length === 0) {
      return fullText;
    }

    // return null if cursor is in delimiter line
    if (delimiterLineNumbers.includes(currentLine)) {
      return null;
    }

    if (currentLine < delimiterLineNumbers[0]) {
      return lines.slice(0, delimiterLineNumbers[0]).join(EOL);
    }

    if (currentLine > delimiterLineNumbers[delimiterLineNumbers.length - 1]) {
      return lines.slice(delimiterLineNumbers[delimiterLineNumbers.length - 1] + 1).join(EOL);
    }

    for (let index = 0; index < delimiterLineNumbers.length - 1; index++) {
      let start = delimiterLineNumbers[index];
      let end = delimiterLineNumbers[index + 1];
      if (start < currentLine && currentLine < end) {
        return lines.slice(start + 1, end).join(EOL);
      }
    }
  }

  private static getDelimiterRows(lines: string[]): number[] {
    let rows: number[] = [];
    for (let index = 0; index < lines.length; index++) {
      if (lines[index].match(Constants.DelimiterStartRegex)) {
        rows.push(index);
      }
    }
    return rows;
  }
}
