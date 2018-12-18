import WebviewProvider from './webview-provider';

export default class SettingsEditor extends WebviewProvider {
  protected id: string = 'settingsEditor';
  protected title: string = 'SQLTools Settings';

  constructor() {
    super();
    this.setMessageCallback((message) => {
      debugger;
    });
  }
}
