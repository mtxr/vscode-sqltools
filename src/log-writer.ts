import * as vscode from 'vscode';
import Constants from './constants';

export default class Logwriter {
  private static outputChannel: vscode.OutputChannel = null;
  private output: vscode.OutputChannel = null;
  constructor() {
    Logwriter.outputChannel = (
      Logwriter.outputChannel || vscode.window.createOutputChannel(`${Constants.extNamespace} Logs`)
    );
    this.output = Logwriter.outputChannel;
  }
  public debug(message: string, ...data: any[]) {
    this.writeLog(`DEBUG: ${message}`, ...data);
  }
  public error(message: string, ...data: any[]) {
    this.writeLog(`ERROR: ${message}`, ...data);
  }
  public info(message: string, ...data: any[]) {
    this.writeLog(`INFO: ${message}`, ...data);
  }
  public warn(message: string, ...data: any[]) {
    this.writeLog(`WARN: ${message}`, ...data);
  }
  public showOutput() {
    this.output.show();
  }
  private writeLog(message: string, ...data: any[]) {
    this.output.appendLine(`[${(new Date()).toLocaleString()}] ${message}`);
    if (data.length > 0) {
      this.output.appendLine(data.join('\n'));
    }
  }
}
