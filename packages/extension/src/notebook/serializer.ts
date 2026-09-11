import { TextDecoder, TextEncoder } from 'util';
import * as vscode from 'vscode';

interface SQLNotebookCell {
  kind: vscode.NotebookCellKind;
  value: string;
  language: string;
}

interface SQLNotebook {
  cells: SQLNotebookCell[];
}

export class SQLNotebookSerializer implements vscode.NotebookSerializer {
  async deserializeNotebook(
    content: Uint8Array,
    _token: vscode.CancellationToken
  ): Promise<vscode.NotebookData> {
    try {
      const contents = new TextDecoder().decode(content);
      
      let raw: SQLNotebookCell[];
      try {
        const parsed = JSON.parse(contents);
        raw = parsed.cells || [];
        console.log(`SQLTools Notebook: Deserialized notebook with ${raw.length} cells`);
      } catch (parseError) {
        console.error('SQLTools Notebook: Error parsing notebook content:', parseError);
        // Return an empty notebook if we can't parse the content
        raw = [];
      }

      const cells = raw.map(
        item => new vscode.NotebookCellData(
          item.kind,
          item.value,
          item.language
        )
      );

      return new vscode.NotebookData(cells);
    } catch (error) {
      console.error('SQLTools Notebook: Error deserializing notebook:', error);
      // Return an empty notebook on error
      return new vscode.NotebookData([]);
    }
  }

  async serializeNotebook(
    data: vscode.NotebookData,
    _token: vscode.CancellationToken
  ): Promise<Uint8Array> {
    try {
      const contents: SQLNotebookCell[] = [];

      for (const cell of data.cells) {
        contents.push({
          kind: cell.kind,
          value: cell.value,
          language: cell.languageId
        });
      }

      console.log(`SQLTools Notebook: Serialized notebook with ${contents.length} cells`);
      return new TextEncoder().encode(JSON.stringify({ cells: contents }));
    } catch (error) {
      console.error('SQLTools Notebook: Error serializing notebook:', error);
      // Return empty notebook data on error
      return new TextEncoder().encode(JSON.stringify({ cells: [] }));
    }
  }
} 