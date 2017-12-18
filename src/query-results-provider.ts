import * as vscode from 'vscode';

export default class QueryResultsProvider implements vscode.TextDocumentContentProvider {
  private content: any[][] = [];
  private evtOnDidChange = new vscode.EventEmitter<vscode.Uri>();
  private styles: string = `<style>
    body {
      margin: 0;
      padding: 0;
    }
    table, th, td {
      padding: 2px;
    }
    table { border-collapse: collapse; }
    .vscode-light * { color: #333; }
    .vscode-dark * { color: #ddd; }
    .vscode-light table th { background: #ddd; }
    .vscode-dark table th { background: #333; }
    .vscode-light table tr:nth-child(2n) { background: #3333330F; }
    .vscode-dark table tr:nth-child(2n) { background: #FFFFFF0F; }
    .vscode-dark table, .vscode-dark th, .vscode-dark td {
      border-style: solid;
      border-width: 1px;
      border-color: #FFFFFF5F;
    }
    .vscode-light table, .vscode-light th, .vscode-light td {
      border-style: solid;
      border-width: 1px;
      border-color: #3333335F;
    }
    </style>`;
  public provideTextDocumentContent(uri: vscode.Uri): string {
    const tables = this.content.map((queryResult) => {
      return this.createResultTable(queryResult);
    }).join('</br>');
    return `
        ${this.styles}
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

  private createResultTable(resultSet: object[] | object): string {
    const resultSetArray: object[] = Array.isArray(resultSet) ? resultSet : [resultSet];

    if (resultSetArray.length === 0) {
      return 'No results.';
    }

    const colNames = Object.keys(resultSetArray[0]);
    const headers = colNames.map((colName, index) => colName ? colName : `Col ${index}`);
    const tableHeaders = '<thead><tr><th>' + headers.join('</th><th>') + '</th></tr></thead>';
    const tableBody = '<tbody><tr>' + resultSetArray.map((row) => {
      return '<td>' + colNames.map((header) => `${row[header]}`).join('</td><td>') + '</td>';
    }).join('</tr><tr>') + '</tr></tbody>';

    return `<table>
        ${tableHeaders}
        ${tableBody}
      </table>`;
  }
}
