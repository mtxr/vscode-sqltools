import { TextDocument, Position, Range } from 'vscode-languageserver';
import { parse } from '@sqltools/util/query';

export const getDocumentCurrentQuery = (document: TextDocument, position: Position): { currentQuery: string; currentQueryTilCursor: string, range: Range } => {
  if (!document || document.uri.startsWith('output')) {
    return {
      currentQuery: null,
      currentQueryTilCursor: null,
      range: null,
    };
  }

  const currentLine = document.getText({ start: { line: position.line, character: 0 }, end: { line: position.line + 1, character: 0 } }).replace(/[\n\r\s]/g, '');
  if (currentLine.length === 0) return {
    currentQuery: '',
    currentQueryTilCursor: '',
    range: { start: position, end: position },
  };
  const text = document.getText();
  const currentOffset = document.offsetAt(position);
  const prefix = text.slice(0, currentOffset+1);
  const allQueries = parse(text);
  const prefixQueries = parse(prefix);
  const currentQuery = allQueries[prefixQueries.length - 1];
  const currentQueryTilCursor = prefixQueries.pop();
  const startIndex = prefix.lastIndexOf(prefixQueries[prefixQueries.length - 1]);
  const start = document.positionAt(startIndex);
  const end = document.positionAt(startIndex + currentQuery.length);
  return {
    currentQuery,
    currentQueryTilCursor,
    range: { start, end },
  };
}