import SQLTools from '@sqltools/core/plugin-api';
import HistoryExplorer from './explorer';
import { DatabaseInterface } from '@sqltools/core/interface';
import { getNameFromId } from '@sqltools/core/utils';
import { quickPick, insertText } from '@sqltools/core/utils/vscode';
import { QuickPickItem, commands } from 'vscode';
import { EXT_NAME } from '@sqltools/core/constants';
import { HistoryTreeGroup, HistoryTreeItem } from './explorer/tree-items';

const hookedCommands = [
  'executeFromInput',
  'executeQuery',
  'executeQueryFromFile',
];

export default class ConnectionManagerPlugin implements SQLTools.ExtensionPlugin {
  private explorer: HistoryExplorer;
  private errorHandler: SQLTools.ExtensionInterface['errorHandler'];
  private addToHistoryHook = (evt: SQLTools.CommandSuccessEvent<DatabaseInterface.QueryResults[]>) => {
    evt.result.forEach(r => {
      this.explorer.addItem(getNameFromId(r.connId), r.query);
    });
  }

  private async historyMenu(prop: string = 'label'): Promise<string> {
    const items = this.explorer.getChildren().reduce<QuickPickItem[]>((agg, group: HistoryTreeGroup) =>
      agg.concat(
        group.items.map<QuickPickItem>(item => ({
          label: item.query,
          detail: item.description,
          description: group.label,
        }))
      ), []);
    return await quickPick(
      items,
      prop,
      {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolderDisabled: 'You don\'t have any queries on your history.',
        title: 'History',
      });
  }

  private ext_runFromHistory = async (entry?: HistoryTreeItem): Promise<DatabaseInterface.QueryResults[]> => {
    let query: string;
    if (entry && entry.query) {
      query = entry.query
    }
    try {
      query = query || (await this.historyMenu());
      return commands.executeCommand(`${EXT_NAME}.executeQuery`, query, false);
    } catch (e) {
      this.errorHandler('Error while running query.', e, `${EXT_NAME}.showOutputChannel`);
    }
  }

  private ext_editHistory = async (entry?: HistoryTreeItem): Promise<void> => {
    let query: string;
    if (entry && entry.query) {
      query = entry.query
    }
    try {
      query = query || (await this.historyMenu());
      insertText(query, true);
    } catch (e) {
      this.errorHandler('Coudl not edtir query.', e, `${EXT_NAME}.showOutputChannel`);
    }
  }

  public register(extension: SQLTools.ExtensionInterface) {
    if (this.explorer) return; // do not register twice

    this.explorer = new HistoryExplorer(extension.context);
    this.errorHandler = extension.errorHandler;
    hookedCommands.forEach(cmd => extension.addAfterCommandSuccessHook(cmd, this.addToHistoryHook));
    extension.registerCommand('runFromHistory', this.ext_runFromHistory)
      .registerCommand('editHistory', this.ext_editHistory);
  }
}