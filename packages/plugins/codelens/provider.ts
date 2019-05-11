import { CodeLensProvider, TextDocument, CodeLens, Range, Command } from 'vscode';
import * as Constants from '@sqltools/core/constants';
import Selector from '@sqltools/core/utils/vscode/selector';

export default class SQLToolsCodeLensProvider implements CodeLensProvider {
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    const lines: string[] = document.getText().split(Constants.LineSplitterRegex);
    const requestRanges: [number, number][] = Selector.getQueryRanges(lines);
    const defaultConn = (document.getText(new Range(0, 0, 1, 0)).match(/@conn\s*([\w_]+)/) || [])[1];
    const lenses: CodeLens[] = [];
    requestRanges.forEach(([blockStart, blockEnd]) => {
      const range = new Range(blockStart, 0, blockEnd, 0);
      const queries = document.getText(range);
      const connName = (queries.match(/@conn\s*([\w_]+)/) || [])[1];
      const runCmd: Command = {
        arguments: [queries, connName || defaultConn],
        title: `Run query block on ${connName || defaultConn || 'active connection'}`.trim(),
        command: `${Constants.EXT_NAME}.executeQuery`,
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
}
