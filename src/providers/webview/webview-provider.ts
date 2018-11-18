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
  private disposablePanel: Disposable;
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
      this.disposablePanel = Disposable.from(
        this.panel,
      );
    }
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
    if (this.disposablePanel) this.disposablePanel.dispose();
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
  <script src="{{extRoot}}/dist/views/vendor.js" type="text/javascript" charset="UTF-8"></script>
  <script src="{{extRoot}}/dist/views/{{id}}.js" type="text/javascript" charset="UTF-8"></script>
</body>
</html>`;
  }
}
