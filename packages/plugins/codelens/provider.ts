import { CodeLensProvider, TextDocument, CodeLens, Range, Command } from 'vscode';
import * as Constants from '@sqltools/core/constants';
import Selector from '@sqltools/core/utils/vscode/selector';

export default class SQLToolsCodeLensProvider implements CodeLensProvider {
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    const lines: string[] = document.getText().split(Constants.LineSplitterRegex);
    const requestRanges: [number, number][] = Selector.getQueryRanges(lines);

    return requestRanges.map(([blockStart, blockEnd]) => {
      const range = new Range(blockStart, 0, blockEnd, 0);
      const queries = document.getText(range);
      const cmd: Command = {
        arguments: [queries],
        title: 'Run Query Block',
        command: `${Constants.EXT_NAME}.executeQuery`,
      };
      return new CodeLens(range, cmd);
    });
  }
}
