import {
  Disposable,
  Uri,
  ViewColumn,
  WebviewPanel,
  window,
} from 'vscode';
import ContextManager from '../../context';

export default abstract class WebviewProvider implements Disposable {
  public get visible() { return this.panel === undefined ? false : this.panel.visible; }
  protected html: string;
  protected abstract id: string;
  protected abstract title: string;
  private panel: WebviewPanel;
  private disposables: Disposable[] = [];
  private get port() {
    return ContextManager.httpServerPort;
  }

  public show() {
    if (!this.panel) {
      this.panel = window.createWebviewPanel(
        this.id,
        this.title,
        ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          enableCommandUris: true,
        },
      );
      this.panel.onDidDispose(this.dispose.bind(this));
      this.disposables.push(Disposable.from(this.panel));

      if (this.messageCb) {
        this.panel.webview.onDidReceiveMessage(this.messageCb, undefined, this.disposables);
      }
    }

    this.panel.title = this.title;
    this.panel.webview.html = (this.html || this.baseHtml)
      .replace(/{{id}}/g, this.id)
      .replace(/{{port}}/g, this.port.toString())
      .replace(
        /{{extRoot}}/g,
        Uri.file(ContextManager.context.asAbsolutePath('.'))
          .with({ scheme: 'vscode-resource' })
          .toString());
    this.panel.reveal();
  }

  public hide() {
    if (this.panel === undefined) return;

    this.panel.dispose();
  }
  public dispose() {
    if (this.disposables.length) this.disposables.forEach(d => d.dispose());
    this.disposables = [];
    this.panel = undefined;
  }

  private get baseHtml(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>SQLTools Setup Helper</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<script type="text/javascript">
window.apiUrl = 'http://localhost:{{port}}'
</script>
<body>
  <div id="root"></div>
  <script src="{{extRoot}}/views/vendor.js" type="text/javascript" charset="UTF-8"></script>
  <script src="{{extRoot}}/views/{{id}}.js" type="text/javascript" charset="UTF-8"></script>
</body>
</html>`;
  }

  public postMessage(message: any) {
    if (!this.panel) return;
    this.panel.webview.postMessage(message);
  }

  private messageCb;
  public setMessageCallback(cb) {
    this.messageCb = cb;
  }
}
