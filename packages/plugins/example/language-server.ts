import { ILanguageServerPlugin, ILanguageServer } from '@sqltools/types';

/**
 * This file should register everything we need to do async.
 * Long requests, query manipulation, server connection e etc.
 */

export default class ExamplePlugin implements ILanguageServerPlugin {
  private server: ILanguageServer;

  public register(server: ILanguageServer) {
    this.server = this.server || server;
  }
}
