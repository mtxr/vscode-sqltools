import { CodeLensProvider, TextDocument, CodeLens, Range, Command, Event, EventEmitter, Selection } from 'vscode';
import * as Constants from '@sqltools/util/constants';
import { getNameFromId } from '@sqltools/util/connection';
import { extractConnName } from '@sqltools/util/query';
import Context from '@sqltools/vscode/context';
import { getAttachedConnection } from '../connection-manager/attached-files';

export default class SQLToolsCodeLensProvider implements CodeLensProvider {
  private _onDidChangeCodeLenses = new EventEmitter<void>();
  get onDidChangeCodeLenses(): Event<void> {
      return this._onDidChangeCodeLenses.event;
  }

  reset() {
    this._onDidChangeCodeLenses.fire();
  }
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    const lenses: CodeLens[] = [];
    const defaultConn = extractConnName(document.getText(new Range(0, 0, 1, 0)));
    const attachedId = getAttachedConnection(document.uri);
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

    const text = document.getText();
    const allBlocks = text.replace(Constants.DELIMITER_START_REGEX, '<#####>$1').split('<#####>');

    if (allBlocks.length === 0) return lenses;

    let textOffset = 0;
    allBlocks.forEach(block => {
      const startIndex = textOffset + text.substr(textOffset).indexOf(block);
      const start = document.positionAt(startIndex);
      const end = document.positionAt(startIndex + block.length);
      const range = new Range(start, end);
      textOffset = startIndex + block.length;
      const connName = extractConnName(block);
      const runCmd: Command = {
        arguments: [block.replace(Constants.DELIMITER_START_REPLACE_REGEX, '').trim(), (connName || defaultConn || '').trim() || undefined].filter(Boolean),
        title: `$(debug-start) Run on ${(connName || defaultConn || 'active connection').trim()}`,
        command: `${Constants.EXT_NAMESPACE}.executeQuery`,
      };
      lenses.push(new CodeLens(range, runCmd));

      const selectCmd: Command = {
        arguments: [new Selection(start, end)],
        title: `$(list-selection) Select block`,
        command: `${Constants.EXT_NAMESPACE}.setSelection`,
      };
      lenses.push(new CodeLens(range, selectCmd));
    });

    return lenses;
  }

  constructor() {
    Context.subscriptions.push(this._onDidChangeCodeLenses);
  }
}
