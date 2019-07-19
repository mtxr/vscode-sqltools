import { VSCodeWebviewAPI } from './interfaces';

declare var acquireVsCodeApi: () => VSCodeWebviewAPI;

export default function getVscode() {
  (window as any).vscode = (window as any).vscode || acquireVsCodeApi();
  return (window as any).vscode as VSCodeWebviewAPI;
}