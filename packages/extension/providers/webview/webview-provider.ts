import {
  Disposable,
  Uri,
  ViewColumn,
  WebviewPanel,
  window,
  EventEmitter,
} from 'vscode';
import ContextManager from '../../context';

export default abstract class WebviewProvider implements Disposable {
  public disposeEvent: EventEmitter<never> = new EventEmitter();
  public get onDidDispose() { return this.disposeEvent.event; }
  public get visible() { return this.panel === undefined ? false : this.panel.visible; }
  private get baseHtml(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${this.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <div id="root"></div>
  <script src="{{extRoot}}/ui/vendor.js" type="text/javascript" charset="UTF-8"></script>
  <script src="{{extRoot}}/ui/{{id}}.js" type="text/javascript" charset="UTF-8"></script>
</body>
</html>`;
  }
  protected html: string;
  protected abstract id: string;
  protected abstract title: string;
  private panel: WebviewPanel;
  private disposables: Disposable[] = [];
  private messageCb;

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
          localResourceRoots: [ContextManager.iconsPath, ContextManager.viewsPath],
        },
      );
      this.panel.iconPath = {
        dark: Uri.file(ContextManager.context.asAbsolutePath('icons/database-dark.svg')),
        light: Uri.file(ContextManager.context.asAbsolutePath('icons/database-light.svg')),
      };
      this.panel.onDidDispose(this.dispose.bind(this));
      this.disposables.push(Disposable.from(this.panel));

      if (this.messageCb) {
        this.panel.webview.onDidReceiveMessage(this.messageCb, undefined, this.disposables);
      }
    }

    this.panel.title = this.title;
    this.panel.webview.html = (this.html || this.baseHtml)
      .replace(/{{id}}/g, this.id)
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
    if (this.disposables.length) this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
    this.panel = undefined;
    this.disposeEvent.fire();
  }

  public postMessage(message: any) {
    if (!this.panel) return;
    this.panel.webview.postMessage(message);
  }
  public setMessageCallback(cb) {
    this.messageCb = cb;
  }
}
