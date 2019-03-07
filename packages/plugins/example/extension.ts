import { SQLToolsExtensionPlugin, SQLToolsLanguageClientInterface, SQLToolsExtensionInterface } from '@sqltools/core/interface/plugin';

export default class ExamplePlugin implements SQLToolsExtensionPlugin {
  public client: SQLToolsLanguageClientInterface;
  register(extension: SQLToolsExtensionInterface) {
    this.client = extension.client;
  }
}