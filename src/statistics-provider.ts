import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export default class StatisticsProvider implements vscode.TextDocumentContentProvider {
  private html: string;
  private evtOnDidChange = new vscode.EventEmitter<vscode.Uri>();
  public constructor(public basePath: string) {
    const a = path.join(__dirname, 'views', 'statistics.html').toString();
    fs.readFile(path.join(__dirname, 'views', 'statistics.html'), (err, data: Buffer) => {
      this.html = data.toString().replace(/\$BASEPATH/g, `${this.basePath}/dist/views`);
    });
  }
  public provideTextDocumentContent(uri: vscode.Uri): string {
    return this.html;
  }

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this.evtOnDidChange.event;
  }

  public update(uri: vscode.Uri) {
    this.evtOnDidChange.fire(uri);
  }
}
