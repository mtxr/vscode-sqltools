import { IExtensionPlugin, ILanguageClient, IExtension } from '@sqltools/types';

/**
 * This file should register everything extension needs.
 * Commands, explorer, webviews, language client request. Language server requests are handled by language-server.ts file.
 */

export default class ExamplePlugin implements IExtensionPlugin {
  public client: ILanguageClient;
  register(extension: IExtension) {
    this.client = extension.client;
  }
}