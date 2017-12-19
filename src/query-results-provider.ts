import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export default class QueryResultsProvider implements vscode.TextDocumentContentProvider {
  private content: any[][] = [];
  private html: string;
  private evtOnDidChange = new vscode.EventEmitter<vscode.Uri>();

  public constructor(public basePath: string, public uri: vscode.Uri) {
    fs.readFile(path.join(__dirname, 'views', 'query-results.html'), (err, data: Buffer) => {
      this.html = data.toString().replace(/\$BASEPATH/g, `${this.basePath}/dist/views`);
    });
  }
  public provideTextDocumentContent(uri: vscode.Uri): string {
    const queryResults = this.content.map((queryResult) => this.prepareResults(queryResult));
    return this.html.replace('$CONTENT', JSON.stringify(queryResults, null, 2));
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this.evtOnDidChange.event;
  }

  public update(uri: vscode.Uri) {
    this.evtOnDidChange.fire(uri);
  }
  public setResults(results: any[]) {
    this.content = results;
    this.update(this.uri);
  }

  private prepareResults(resultSet: object[] | object): {cols: any[], data: any[]} {
    const data: object[] = Array.isArray(resultSet) ? resultSet : [resultSet];

    if (true && data.length === 0) {
      return {
        cols: [{ Header: 'Result', accessor: 'fisrt' }],
        data: [{ first: 'No results.'}],
      };
    }

    const cols = Object.keys(data[0]).map((colName, index) => {
      return {
        Header: colName,
        accessor: colName,
      };
    });
    return {
      cols,
      data,
    };
  }
}
