import { TextEditor, Range } from 'vscode';
import { query as QueryUtils } from '@sqltools/core/utils';

export const getEditorQueryDetails = (editor: TextEditor): { currentQuery: string, range: Range } => {
  if (!editor || !editor.document || editor.document.uri.scheme === 'output') {
    return {
      currentQuery: null,
      range: null,
    };
  }
  if (!editor.selection.isEmpty) {
    return {
      currentQuery: editor.document.getText(editor.selection),
      range: editor.selection
    };
  }
  const currentLine = editor.document.getText(new Range(editor.selection.active.line, 0, editor.selection.active.line + 1, 0)).replace(/[\n\r\s]/g, '');
  if (currentLine.length === 0) return {
    currentQuery: '',
    range: editor.selection,
  };
  const text = editor.document.getText();
  const currentOffset = editor.document.offsetAt(editor.selection.active);
  const prefix = text.slice(0, currentOffset+1);
  const allQueries = QueryUtils.parse(text);
  const prefixQueries = QueryUtils.parse(prefix);
  const currentQuery = allQueries[prefixQueries.length-1];
  const startIndex = prefix.lastIndexOf(prefixQueries[prefixQueries.length - 1]);
  const startPos = editor.document.positionAt(startIndex);
  const endPos = editor.document.positionAt(startIndex + currentQuery.length);
  return {
    currentQuery,
    range: new Range(startPos, endPos)
  };
}