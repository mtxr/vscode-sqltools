import { LanguageServerPlugin } from '@sqltools/core/interface/plugin';
import SQLToolsLanguageServer from '@sqltools/language-server/server';

export default class ExamplePlugin implements LanguageServerPlugin {
  private server: SQLToolsLanguageServer;

  public register(server: SQLToolsLanguageServer) {
    this.server = this.server || server;
  }
}
