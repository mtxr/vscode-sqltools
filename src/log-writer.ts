import {
  OutputChannel,
  window,
} from 'vscode';
import Constants from './constants';

export default class Logwriter {
  private static outputChannel: OutputChannel = null;
  private output: OutputChannel = null;
  constructor() {
    Logwriter.outputChannel = (
      Logwriter.outputChannel || window.createOutputChannel(`${Constants.extNamespace} Logs`)
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
  public getOutputChannel(): OutputChannel {
    return this.output;
  }

  public writeLog(message: string, ...data: any[]) {
    const date = (new Date()).toISOString().substring(0, 20);
    this.output.appendLine(`[${date}][${Constants.version}] ${message}`);
    if (data.length > 0) {
      data.forEach((obj: any | object) => {
        if (typeof obj === 'object' || Array.isArray(obj)) {
          return this.output.appendLine(`[${date}][${Constants.version}] ` + JSON.stringify(obj));
        }
        return this.output.appendLine(`[${date}][${Constants.version}] ` + obj.toString());
      });
    }
  }
}
