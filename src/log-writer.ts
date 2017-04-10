import * as vscode from 'vscode';
import Constants from './constants';

const outputChannel = vscode.window.createOutputChannel(`${Constants.extNamespace} Logs`);
const writeLog = (message: string, ...data: any[]) => {
  const richData = data.length > 0 ? `: ${JSON.stringify(data)}` : '';
  outputChannel.appendLine(`${message}${richData}`);
};

export default class Logwriter {
  public debug (message: string, ...data: any[]) {
    writeLog(message, ...data);
  }
  public error (message: string, ...data: any[]) {
    writeLog(message, ...data);
  }
  public info (message: string, ...data: any[]) {
    writeLog(message, ...data);
  }
  public warn (message: string, ...data: any[]) {
    writeLog(message, ...data);
  }
}
