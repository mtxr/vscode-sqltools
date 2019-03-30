/**
 * This file should register everything extension needs.
 * Commands, explorer, webviews, language client request. Language server requests are handled by language-server.ts file.
 */

import SQLTools from '@sqltools/core/plugin-api';

export default class ExamplePlugin implements SQLTools.ExtensionPlugin {
  public client: SQLTools.LanguageClientInterface;
  register(extension: SQLTools.ExtensionInterface) {
    this.client = extension.client;
  }
}