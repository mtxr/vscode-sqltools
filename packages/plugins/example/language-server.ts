/**
 * This file should register everything we need to do async.
 * Long requests, query manipulation, server connection e etc.
 */

import SQLTools from '@sqltools/core/plugin-api';

export default class ExamplePlugin implements SQLTools.LanguageServerPlugin {
  private server: SQLTools.LanguageServerInterface;

  public register(server: SQLTools.LanguageServerInterface) {
    this.server = this.server || server;
  }
}
