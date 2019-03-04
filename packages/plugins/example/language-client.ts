import { LanguageClientPlugin, SQLToolsLanguageClientInterface } from '@sqltools/core/interface/plugin';

export default class ExamplePlugin implements LanguageClientPlugin {
  public client: SQLToolsLanguageClientInterface;
  register(client: SQLToolsLanguageClientInterface) {
    this.client = client;
  }
}