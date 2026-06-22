export function selectedTextOrCurrentLine(documentText: string, selectionText: string, cursorLine: number): string {
  if (selectionText.length > 0) {
    return selectionText;
  }

  const lines = documentText.split(/\r?\n/);
  if (lines.length === 0) {
    return '';
  }

  const clampedLine = Math.min(Math.max(cursorLine, 0), lines.length - 1);
  return lines[clampedLine] || '';
}

export function selectedTextOrCurrentBlock(documentText: string, selectionText: string, cursorLine: number): string {
  if (selectionText && selectionText.trim().length > 0) {
    return selectionText;
  }
  return currentQBlock(documentText, cursorLine);
}

export function currentQBlock(documentText: string, cursorLine: number): string {
  const lines = documentText.split(/\r?\n/);
  if (lines.length === 0) {
    return '';
  }

  const clampedLine = Math.min(Math.max(cursorLine, 0), lines.length - 1);
  let start = clampedLine;
  let end = clampedLine;

  while (start > 0 && lines[start].trim().length === 0) {
    start--;
  }
  while (end < lines.length - 1 && lines[end].trim().length === 0) {
    end++;
  }

  while (start > 0 && lines[start - 1].trim().length > 0) {
    start--;
  }
  while (end < lines.length - 1 && lines[end + 1].trim().length > 0) {
    end++;
  }

  return lines.slice(start, end + 1).join('\n');
}
