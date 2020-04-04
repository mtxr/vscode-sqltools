import logger from '@sqltools/util/log';
import getVscode from './vscode';
export const messageLog = logger.extend('message');

export const sendMessage = (action: string, payload?: any) => {
  getVscode().postMessage({ action, payload });
  messageLog('sent => %s %O', action, payload);
};

export default sendMessage;
