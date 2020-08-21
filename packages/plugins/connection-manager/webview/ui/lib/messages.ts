import { createLogger } from '@sqltools/log/src';
import getVscode from './vscode';
export const messageLog = createLogger();

export const sendMessage = (action: string, payload?: any) => {
  getVscode().postMessage({ action, payload });
  messageLog.debug('sent => %s %O', action, payload);
};

export default sendMessage;
