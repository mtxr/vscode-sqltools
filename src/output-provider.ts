import * as vscode from 'vscode';

export default class OutputProvider implements vscode.TextDocumentContentProvider {
  private content: any[][];
  private evtOnDidChange = new vscode.EventEmitter<vscode.Uri>();

  public provideTextDocumentContent(uri: vscode.Uri): string {
    const head = `<style>
    body {
      color: gray;
      margin: 0;
      padding: 0;
    }
    table {
      border-collapse: collapse;
    }

    table, th, td {
      border: 1px solid gray;
    }
    </style>`;

    const tables = this.content.map((queryResult) => {
      return this.createResultTable(queryResult);
    }).join('</br>');
    return `
        ${head}
        <body>
          ${tables}
        </body>`;
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this.evtOnDidChange.event;
  }

  public update(uri: vscode.Uri) {
    this.evtOnDidChange.fire(uri);
  }
  public setResults(results: any[]) {
    this.content = results;
  }

  private createResultTable(rowset: object[]): string {
    if (rowset.length === 0) return 'No results.';
    const colNames = Object.keys(rowset[0]);
    const headers = colNames.map((colName, index) => colName ? colName : `Col ${index}`);
    const tableHeaders = '<thead><tr><th>' + headers.join('</th><th>') + '</th></tr></thead>';
    const tableBody = '<tbody><tr>' + rowset.map((row) => {
      return '<td>' + colNames.map((header) => row[header]).join('</td><td>') + '</td>';
    }).join('</tr><tr>') + '</tr></tbody>';

    return `<table>
        ${tableHeaders}
        ${tableBody}
      </table>`;
  }
}
