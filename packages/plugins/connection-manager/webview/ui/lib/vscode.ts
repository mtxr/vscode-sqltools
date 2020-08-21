import { IVSCodeWebviewAPI } from '../interfaces';

let vscode: IVSCodeWebviewAPI;

declare var acquireVsCodeApi: () => IVSCodeWebviewAPI;

export default function getVscode() {
  vscode = vscode || acquireVsCodeApi();
  return vscode as IVSCodeWebviewAPI;
}