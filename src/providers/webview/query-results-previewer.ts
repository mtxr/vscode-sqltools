import WebviewProvider from './webview-provider';

export default class QueryResultsPreviewer extends WebviewProvider {
  protected id: string = 'queryResultsPreviewer';
  protected title: string = 'SQLTools Results';

  public show() {
    if (this.visible) this.postMessage({ action: 'refresh' });
    super.show();
  }
}
