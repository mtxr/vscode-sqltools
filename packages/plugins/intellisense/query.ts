import { TextDocument, Position } from 'vscode-languageserver-textdocument';

export const getDocumentCurrentQuery = (document: TextDocument, position: Position): { text: string, currentOffset: number } => {
  if (!document || document.uri.startsWith('output')) {
    return {
      text: '',
      currentOffset: -1
    };
  }

  const currentLine = document.getText({ start: { line: position.line, character: 0 }, end: { line: position.line + 1, character: 0 } }).replace(/[\n\r\s]/g, '');
  if (currentLine.length === 0) return {
    text: '',
    currentOffset: -1
  };
  const text = document.getText();
  const currentOffset = document.offsetAt(position);
  return {
    text,
    currentOffset,
  };
}