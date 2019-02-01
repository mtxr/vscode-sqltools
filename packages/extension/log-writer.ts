import {
  OutputChannel,
  window,
} from 'vscode';
import { EXT_NAME, VERSION } from '@sqltools/core/constants';

namespace Logwriter {
  const outputChannel = window.createOutputChannel('SQLTools');
  export function debug(message: string, ...data: any[]) {
    writeLog(`DEBUG: ${message}`, ...data);
  }
  export function error(message: string, ...data: any[]) {
    writeLog(`ERROR: ${message}`, ...data);
  }
  export function info(message: string, ...data: any[]) {
    writeLog(`INFO: ${message}`, ...data);
  }
  export function warn(message: string, ...data: any[]) {
    writeLog(`WARN: ${message}`, ...data);
  }
  export function showOutput() {
    outputChannel.show();
  }
  export function getOutputChannel(): OutputChannel {
    return outputChannel;
  }

  export function writeLog(message: string, ...data: any[]) {
    const date = (new Date()).toISOString().substring(0, 20);
    outputChannel.appendLine(`[${date}][${VERSION}] ${message}`);
    if (data.length > 0) {
      data.forEach((obj: any | object) => {
        if (typeof obj === 'object' || Array.isArray(obj)) {
          return outputChannel.appendLine(`[${date}][${VERSION}] ` + JSON.stringify(obj));
        }
        return outputChannel.appendLine(`[${date}][${VERSION}] ` + obj.toString());
      });
    }
  }
}
export default Logwriter;
