import SQLTools from '@sqltools/core/plugin-api';
import HistoryExplorer from './explorer';
import { DatabaseInterface } from '@sqltools/core/interface';
import { getNameFromId } from '@sqltools/core/utils';

const hookedCommands = [
  'executeFromInput',
  'executeQuery',
  'executeQueryFromFile',
];

export default class ConnectionManagerPlugin implements SQLTools.ExtensionPlugin {
  private explorer: HistoryExplorer;
  private addToHistoryHook = (evt: SQLTools.CommandSuccessEvent<DatabaseInterface.QueryResults[]>) => {
    evt.result.forEach(r => {
      this.explorer.addItem(getNameFromId(r.connId), r.query);
    });
  }

  public register(extension: SQLTools.ExtensionInterface) {
    if (this.explorer) return; // do not register twice

    this.explorer = new HistoryExplorer(extension.context);

    hookedCommands.forEach(cmd => extension.addAfterCommandSuccessHook(cmd, this.addToHistoryHook))
  }
}