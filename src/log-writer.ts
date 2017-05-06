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
  public getOutputChannel(): vscode.OutputChannel {
    return this.output;
  }

  private writeLog(message: string, ...data: any[]) {
    const date = (new Date()).toLocaleString();
    this.output.appendLine(`[${date}][${Constants.version}] ${message}`);
    if (data.length > 0) {
      data.forEach((obj) => {
        try {
          this.output.appendLine(`[${date}][${Constants.version}]` + JSON.stringify(data));
        } catch (e) {
          this.output.appendLine(`[${date}][${Constants.version}]` + data.toString());
        }
      });
    }
  }
}
