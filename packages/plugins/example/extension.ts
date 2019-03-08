import SQLTools from '@sqltools/core/plugin-api';

export default class ExamplePlugin implements SQLTools.ExtensionPlugin {
  public client: SQLTools.LanguageClientInterface;
  register(extension: SQLTools.ExtensionInterface) {
    this.client = extension.client;
  }
}