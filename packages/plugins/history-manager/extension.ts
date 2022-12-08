import { NSDatabase, IExtensionPlugin, IExtension, ICommandSuccessEvent } from '@sqltools/types';
import HistoryExplorer from './explorer';
import { getNameFromId } from '@sqltools/util/connection';
import { insertText } from '@sqltools/vscode/utils';
import { quickPick } from '@sqltools/vscode/utils/quickPick';
import { QuickPickItem, commands } from 'vscode';
import { EXT_NAMESPACE } from '@sqltools/util/constants';
import { HistoryTreeGroup, HistoryTreeItem } from './explorer/tree-items';

const hookedCommands = [
  'executeFromInput',
  'executeQuery',
  'executeCurrentQuery',
  'executeQueryFromFile',
];

export default class ConnectionManagerPlugin implements IExtensionPlugin {
  public readonly name = 'History Manager Plugin';
  private explorer: HistoryExplorer;
  private errorHandler: IExtension['errorHandler'];
  private addToHistoryHook = (evt: ICommandSuccessEvent<NSDatabase.IResult[]>) => {
    evt.result.forEach(r => {
      this.explorer.addItem(getNameFromId(r.connId), r.query);
    });
  }

  private async historyMenu(prop: string = 'label'): Promise<string> {
    const items = this.explorer.getChildren().reduce<QuickPickItem[]>((agg, group: HistoryTreeGroup) =>
      agg.concat(
        group.items.map<QuickPickItem>(item => ({
          label: item.query,
          detail: typeof item.description === "string" ? item.description : "",
          description: typeof group.label === 'string' ? group.label : group.label?.label,
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

  private ext_runFromHistory = async (entry?: HistoryTreeItem): Promise<NSDatabase.IResult[]> => {
    let query: string;
    if (entry && entry.query) {
      query = entry.query
    }
    try {
      query = query || (await this.historyMenu());
      return commands.executeCommand(`${EXT_NAMESPACE}.executeQuery`, query, false);
    } catch (e) {
      this.errorHandler('Error while running query.', e);
    }
  }

  private ext_clearHistory = async () => {
    this.explorer.clear();
  }

  private ext_editHistory = async (entry?: HistoryTreeItem): Promise<void> => {
    let query: string;
    if (entry && entry.query) {
      query = entry.query
    }
    try {
      query = query || (await this.historyMenu());
      insertText(query);
    } catch (e) {
      this.errorHandler('Could not edit query.', e);
    }
  }

  public register(extension: IExtension) {
    if (this.explorer) return; // do not register twice

    this.explorer = new HistoryExplorer();
    this.errorHandler = extension.errorHandler;
    hookedCommands.forEach(cmd => extension.addAfterCommandSuccessHook(cmd, this.addToHistoryHook));
    extension.registerCommand('runFromHistory', this.ext_runFromHistory)
      .registerCommand('editHistory', this.ext_editHistory)
      .registerCommand('clearHistory', this.ext_clearHistory);
  }
}