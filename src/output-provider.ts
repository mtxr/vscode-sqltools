import * as vscode from 'vscode';

export default class OutputProvider implements vscode.TextDocumentContentProvider {
  private content: any[][];
  private evtOnDidChange = new vscode.EventEmitter<vscode.Uri>();
  private styles: string = `<style>
    body {
      color: gray;
      margin: 0;
      padding: 0;
    }
    table {
      background: #eaeaea;
      border-collapse: collapse;
    }
    table tr:nth-child(2n) {
      background: #ffffff;
    }
    table th {
      color: #ffffff;
      background: #666666;
    }
    table, th, td {
      padding: 2px;
      border: 1px solid #333;
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
