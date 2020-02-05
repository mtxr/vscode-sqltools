import { CodeLensProvider, TextDocument, CodeLens, Range, Command, Event, EventEmitter } from 'vscode';
import * as Constants from '@sqltools/util/constants';
import Selector from '@sqltools/vscode/utils/selector';
import { getNameFromId } from '@sqltools/util/connection';
import { extractConnName } from '@sqltools/util/query';
import Context from '@sqltools/vscode/context';

export default class SQLToolsCodeLensProvider implements CodeLensProvider {
  private _onDidChangeCodeLenses = new EventEmitter<void>();
  get onDidChangeCodeLenses(): Event<void> {
      return this._onDidChangeCodeLenses.event;
  }

  reset() {
    this._onDidChangeCodeLenses.fire();
  }
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    const lines: string[] = document.getText().split(Constants.LINE_SPLITTER_REGEX);
    const requestRanges: [number, number][] = Selector.getQueryRanges(lines);
    const defaultConn = extractConnName(document.getText(new Range(0, 0, 1, 0)));
    const lenses: CodeLens[] = [];
    const attachedId = Context.workspaceState.get('attachedFilesMap', {})[document.uri.toString()];
    if (attachedId) {
      // attached to a connection
      const connName = getNameFromId(attachedId);
      const runCmd: Command = {
        arguments: [document.uri],
        title: `Detach file from ${connName.trim()}`,
        command: `${Constants.EXT_NAMESPACE}.detachConnectionFromFile`,
      };
      lenses.push(new CodeLens(new Range(0, 0, 0, 0), runCmd))
    }
    requestRanges.forEach(([blockStart, blockEnd]) => {
      const range = new Range(blockStart, 0, blockEnd, 0);
      const queries = document.getText(range);
      const connName = extractConnName(queries);
      const runCmd: Command = {
        arguments: [queries, (connName || defaultConn || '').trim() || undefined].filter(Boolean),
        title: `Run query block on ${(connName || defaultConn || 'active connection').trim()}`,
        command: `${Constants.EXT_NAMESPACE}.executeQuery`,
      };
      lenses.push(new CodeLens(range, runCmd));
      // @todo select query block
      // const selectBlock: Command = {
      //   arguments: [new Selection(blockStart, 0, blockEnd + 1, 0)],
      //   title: 'Select block',
      //   command: `setSelection`,
      // };
      // lenses.push(new CodeLens(range, selectBlock));
    });

    return lenses;
  }

  constructor() {
    Context.subscriptions.push(this._onDidChangeCodeLenses);
  }
}
