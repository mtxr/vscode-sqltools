import { Telemetry } from '@sqltools/core/utils';
import { commands, window } from 'vscode';
import { openExternal } from '@sqltools/core/utils/vscode';
import { ResponseError } from 'vscode-jsonrpc';
import { EXT_NAME, DOCS_ROOT_URL } from '@sqltools/core/constants';
namespace ErrorHandler {
  let telemetry: Telemetry;
  export function create(message: string): (reason: any) => void {
    return async (error: any): Promise<void> => {
      if (error) {
        if (error.dontNotify || (error.data && error.data.dontNotify)) return;
        telemetry.registerException(error, error.data);
        message = `${message} ${error.message ? error.message : error.toString()}`;
      }
      output(message, error);
    };
  }
  export function setTelemetryClient(cli: Telemetry) {
    telemetry = cli;
  }

  async function output(message: string, error: ResponseError<any>) {
    const options = ['View Logs'];
    if (error.data && error.data.dialect) {
      options.push('Help!');
    }

    switch (await window.showErrorMessage(message, ...options)) {
      case 'View Logs':
        commands.executeCommand(`${EXT_NAME}.showOutputChannel`);
        break;
      case 'Help!':
        openExternal(`${DOCS_ROOT_URL}/connections/${error.data.dialect.toLowerCase()}#${typeof error.code === 'string' ? error.code : error.name}`);
        break;
    }
  }
}

export default ErrorHandler;
