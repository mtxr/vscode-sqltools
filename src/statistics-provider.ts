import fs = require('fs');
import path = require('path');
import {
  Event,
  EventEmitter,
  TextDocumentContentProvider,
  Uri,
} from 'vscode';

export default class StatisticsProvider implements TextDocumentContentProvider {
  private html: string;
  private evtOnDidChange = new EventEmitter<Uri>();
  public constructor(public basePath: string) {
    const a = path.join(__dirname, 'views', 'statistics.html').toString();
    fs.readFile(path.join(__dirname, 'views', 'statistics.html'), (err, data: Buffer) => {
      this.html = data.toString().replace(/\$BASEPATH/g, `${this.basePath}/dist/views`);
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
}
