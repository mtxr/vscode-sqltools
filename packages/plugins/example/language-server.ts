import { ILanguageServerPlugin, ILanguageServer } from '@sqltools/types';

/**
 * This file should register everything we need to do async.
 * Long requests, query manipulation, server connection e etc.
 */

export default class ExamplePlugin<T extends ILanguageServer> implements ILanguageServerPlugin<T> {
  private server: T;

  public register(server: T) {
    this.server = this.server || server;
  }
}
