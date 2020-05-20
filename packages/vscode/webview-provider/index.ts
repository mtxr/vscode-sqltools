import { Uri, commands, Disposable, EventEmitter, ViewColumn, WebviewPanel, window } from 'vscode';
import { getIconPaths } from '@sqltools/vscode/icons';
import Context from '@sqltools/vscode/context';
import { EXT_NAMESPACE } from '@sqltools/util/constants';
import path from 'path';
import { DefaultUIAction } from './action';

export default abstract class WebviewProvider<State = any> implements Disposable {
  get serializationId() {
    return this.id;
  }
  public disposeEvent: EventEmitter<never> = new EventEmitter();
  public get onDidDispose() {
    return this.disposeEvent.event;
  }
  public get visible() { return this.panel === undefined ? false : this.panel.visible; }
  protected cssVariables: { [name: string]: string };
  private get baseHtml(): string {
    const cssVariables = Object.keys(this.cssVariables || {}).map(k => `--sqltools-${k}: ${this.cssVariables[k]}`).join(';');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${this.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
  :root {${cssVariables}}
  </style>
  <link rel="stylesheet" type="text/css" href="${this.panel.webview.asWebviewUri(Uri.file(Context.asAbsolutePath(`./ui/commons.css`)))}">
</head>
<body>
  <link rel="stylesheet" type="text/css" href="${this.panel.webview.asWebviewUri(Uri.file(Context.asAbsolutePath(`./ui/theme.css`)))}">
  <div id="root"></div>
  <script src="${this.panel.webview.asWebviewUri(Uri.file(Context.asAbsolutePath(`./ui/vendor.js`)))}" type="text/javascript" charset="UTF-8"></script>
  <script src="${this.panel.webview.asWebviewUri(Uri.file(Context.asAbsolutePath(`./ui/commons.js`)))}" type="text/javascript" charset="UTF-8"></script>
  <script src="${this.panel.webview.asWebviewUri(Uri.file(Context.asAbsolutePath(`./ui/${this.id}.js`)))}" type="text/javascript" charset="UTF-8"></script>
</body>
</html>`;
  }
  protected html: string;
  protected abstract id: string;
  protected abstract title: string;
  private panel: WebviewPanel;
  private disposables: Disposable[] = [];
  private messageCb;

  public constructor() {}
  public preserveFocus = true;
  public wereToShow = ViewColumn.One;
  public show() {
    if (!this.panel) {
      this.panel = window.createWebviewPanel(
        this.serializationId,
        this.title,
        this.wereToShow,
        {
          enableScripts: true,
          retainContextWhenHidden: true, // @OPTIMIZE remove and migrate to state restore
          enableCommandUris: true,
          localResourceRoots: [Uri.file(path.resolve(Context.extensionPath, '..')).with({ scheme: 'vscode-resource' })],
          // enableFindWidget: true,
        },
      );
      this.panel.iconPath = getIconPaths('database-active');
      this.panel.webview.onDidReceiveMessage(this.onDidReceiveMessage, null, this.disposables);
      this.panel.onDidChangeViewState(({ webviewPanel }) => {
        this.setPreviewActiveContext(webviewPanel.active);
        this.onViewActive && this.onViewActive(webviewPanel.active);
      }, null, this.disposables);
      this.panel.onDidDispose(this.dispose, null, this.disposables);
      this.panel.webview.html = this.html || this.baseHtml;
    }

    this.updatePanelName();

    this.panel.reveal(this.wereToShow, this.preserveFocus);
    this.setPreviewActiveContext(true);
  }

  public onViewActive?: (active: boolean) => any;
  private onDidReceiveMessage = ({ action, payload, ...rest}) => {
    switch(action) {
      case DefaultUIAction.RESPONSE_STATE:
        this.lastState = payload;
        break;
      case DefaultUIAction.CALL:
        return commands.executeCommand(payload.command, ...(payload.args || []));
      case DefaultUIAction.NOTIFY_VIEW_READY:
        process.env.NODE_ENV === 'development' && commands.executeCommand('workbench.action.webview.openDeveloperTools');
        break;
    }
    if (this.messageCb) {
      this.messageCb(({ action, payload, ...rest }));
    }
  }

  public get isActive() {
    return this.panel && this.panel.active;
  }

  public get asWebviewUri() {
    return this.panel ? this.panel.webview.asWebviewUri : (() => '');
  }
  public hide = () => {
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

  public postMessage = (message: any) => {
    if (!this.panel) return;
    this.panel.webview.postMessage(message);
  }
  public setMessageCallback = (cb) => {
    this.messageCb = cb;
  }

  private setPreviewActiveContext = (value: boolean) => {
		commands.executeCommand('setContext', `${EXT_NAMESPACE}.${this.id}.active`, value);
  }

  private lastState = undefined;
  public getState = (): Promise<State> => {
    if (!this.panel) return Promise.resolve(null);

    return new Promise((resolve, reject) => {
      let attempts = 0;
      const timer = setInterval(() => {
        if (typeof this.lastState === 'undefined') {
          if (attempts < 10) return attempts++;

          clearInterval(timer);
          return reject(new Error(`Could not get the state for ${this.panel.title}`));
        }
        clearInterval(timer);
        const state = this.lastState;
        this.lastState = undefined;
        return resolve(state);
      }, 200);
      this.panel.webview.postMessage({ action: DefaultUIAction.REQUEST_STATE });
    })
  }

  public updatePanelName = () => {
    if (this.panel) this.panel.title = this.title;
  }
}
