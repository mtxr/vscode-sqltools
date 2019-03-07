import { SQLToolsExtensionPlugin, SQLToolsLanguageClientInterface } from '@sqltools/core/interface/plugin';

export default class ExamplePlugin implements SQLToolsExtensionPlugin {
  public client: SQLToolsLanguageClientInterface;
  register(client: SQLToolsLanguageClientInterface) {
    this.client = client;
  }
}