import fs = require('fs');
import path = require('path');
import {
  Event,
  EventEmitter,
  TextDocumentContentProvider,
  Uri,
} from 'vscode';
import DatabaseInterface from './api/interface/database-interface';

export default class QueryResultsProvider implements TextDocumentContentProvider {
  private content: DatabaseInterface.QueryResults[] = [];
  private html: string;
  private htmlOriginal: string;
  private evtOnDidChange = new EventEmitter<Uri>();

  public constructor(public basePath: string, public uri: Uri) {
    fs.readFile(path.join(__dirname, 'views', 'query-results.html'), (err, data: Buffer) => {
      this.html = data.toString().replace(/\$BASEPATH/g, `${this.basePath}/dist/views`);
      this.htmlOriginal = this.html;
    });
  }
  public provideTextDocumentContent(uri: Uri): string {
    return this.html;
  }

  get onDidChange(): Event<Uri> {
    return this.evtOnDidChange.event;
  }

  public update(uri: Uri) {
    this.evtOnDidChange.fire(uri);
  }
  public setResults(results: DatabaseInterface.QueryResults[]) {
    this.content = results.map((queryResult) => this.prepareResults(queryResult));
    this.html = this.htmlOriginal.replace('$CONTENT', JSON.stringify(this.content, null, 2));
    this.update(this.uri);
  }

  private prepareResults(resultSet: DatabaseInterface.QueryResults) {
    const data: object[] = resultSet.results;

    resultSet.cols = resultSet.cols.map((colName, index) => {
      return {
        Header: colName,
        accessor: colName,
      };
    }) as any;
    return resultSet;
  }
}
