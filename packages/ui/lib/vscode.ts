import { VSCodeWebviewAPI } from './interfaces';

let vscode: VSCodeWebviewAPI;

declare var acquireVsCodeApi: () => VSCodeWebviewAPI;

export default function getVscode() {
  vscode = vscode || acquireVsCodeApi();
  return vscode as VSCodeWebviewAPI;
}