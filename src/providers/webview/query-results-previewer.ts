import WebviewProvider from './webview-provider';

export default class QueryResultsPreviewer extends WebviewProvider {
  protected id: string = 'queryResultsPreviewer';
  protected title: string = 'SQLTools';

  public show(title = 'SQLTools') {
    this.title = title;
    super.show();
  }
}
