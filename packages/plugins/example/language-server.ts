/**
 * This file should register everything we need to do async.
 * Long requests, query manipulation, server connection e etc.
 */

import SQLTools from '@sqltools/core/plugin-api';
import SQLToolsLanguageServer from '@sqltools/language-server/server';

export default class ExamplePlugin implements SQLTools.LanguageServerPlugin {
  private server: SQLToolsLanguageServer;

  public register(server: SQLToolsLanguageServer) {
    this.server = this.server || server;
  }
}
