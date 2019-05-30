import { Uri, commands, Disposable, EventEmitter, ExtensionContext, ViewColumn, WebviewPanel, window } from 'vscode';

export default abstract class WebviewProvider<State = any> implements Disposable {
  public disposeEvent: EventEmitter<never> = new EventEmitter();
  public get onDidDispose() {
    return this.disposeEvent.event;
  }
  public get visible() { return this.panel === undefined ? false : this.panel.visible; }
  protected cssVariables: { [name: string]: string };
  private get baseHtml(): string {
    const cssVariables = Object.keys(this.cssVariables || {}).map(k => `--sqltools-${k}: ${this.cssVariables[k]}`).join(';');
    const extRoot = Uri.file(this.context.asAbsolutePath('.'))
    .with({ scheme: 'vscode-resource' })
    .toString();

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${this.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
  :root {${cssVariables}}
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="${extRoot}/ui/vendor.js" type="text/javascript" charset="UTF-8"></script>
  <script src="${extRoot}/ui/${this.id}.js" type="text/javascript" charset="UTF-8"></script>
</body>
</html>`;
  }
  protected html: string;
  protected abstract id: string;
  protected abstract title: string;
  private panel: WebviewPanel;
  private disposables: Disposable[] = [];
  private messageCb;

  public constructor(private context: ExtensionContext, private iconsPath: Uri, private viewsPath: Uri) {}
  public preserveFocus = true;
  public wereToShow = ViewColumn.One;
  public show() {
    if (!this.panel) {
      this.panel = window.createWebviewPanel(
        this.id,
        this.title,
        this.wereToShow,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          enableCommandUris: true,
          localResourceRoots: [this.iconsPath, this.viewsPath],
          enableFindWidget: true,
        },
      );
      this.panel.iconPath = Uri.file(this.context.asAbsolutePath('icons/database-active.svg'));
      this.disposables.push(Disposable.from(this.panel));
      this.disposables.push(this.panel.webview.onDidReceiveMessage(this.onDidReceiveMessage, undefined, this.disposables));
      this.disposables.push(this.panel.onDidChangeViewState(({ webviewPanel }) => {
        this.setPreviewActiveContext(webviewPanel.active);
      }));
      this.disposables.push(this.panel.onDidDispose(this.dispose, null, this.disposables));
      this.panel.webview.html = this.html || this.baseHtml;
    }

    this.updatePanelName();

    this.panel.reveal(this.wereToShow, this.preserveFocus);
    this.postMessage({ action: 'reset' });
    this.setPreviewActiveContext(true);
    // if (process.env.NODE_ENV === 'development') {
    //   setTimeout(() => {
    //     commands.executeCommand('workbench.action.webview.openDeveloperTools');
    //   }, 1000);
    // }
  }

  private onDidReceiveMessage = ({ action, payload, ...rest}) => {
    switch(action) {
      case 'receivedState':
        this.lastState = payload;
        break;
      case 'call':
        commands.executeCommand(payload.command, ...(payload.args || []));
        break;
    }
    if (this.messageCb) {
      this.messageCb(({ action, payload, ...rest }));
    }
  }

  public hide() {
    if (this.panel === undefined) return;
    this.setPreviewActiveContext(false);
    this.panel.dispose();
  }
  public dispose = () => {
    this.hide();
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

  private setPreviewActiveContext(value: boolean) {
		commands.executeCommand('setContext', `sqltools.${this.id}.active`, value);
  }

  private lastState = undefined;
  public getState(): Promise<State> {
    if (!this.panel) return Promise.resolve(null);

    return new Promise((resolve, reject) => {
      let attempts = 0;
      const timer = setInterval(() => {
        if (typeof this.lastState === 'undefined') {
          if (attempts < 10) return attempts++;

          clearInterval(timer);
          return reject(new Error(`Could not get the state for ${this.id}`));
        }
        clearInterval(timer);
        const state = this.lastState;
        this.lastState = undefined;
        return resolve(state);
      }, 200);
      this.panel.webview.postMessage({ action: 'getState' });
    })
  }

  public updatePanelName () {
    this.panel.title = this.title;
  }
}
