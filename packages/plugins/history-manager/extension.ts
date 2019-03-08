import SQLTools from '@sqltools/core/plugin-api';
import { ExtensionContext } from 'vscode';
import HistoryExplorer from './explorer';

export default class ConnectionManagerPlugin implements SQLTools.ExtensionPlugin {
  private context: ExtensionContext;
  private explorer: HistoryExplorer;

  public register(extension: SQLTools.ExtensionInterface) {
    if (this.context) return; // do not register twice
    this.context = extension.context;

    this.explorer = new HistoryExplorer();
    this.explorer.refresh();
  }
}