import { ResponseError } from 'vscode-languageserver';
import { MissingModuleNotification } from '@sqltools/plugins/dependency-manager/contracts';
import { ConnectionInterface } from '../interface';


interface NotifyResponseErrorData {
  notification: string; dontNotify?: boolean; args?: any
};
class NotifyResponseError extends ResponseError<NotifyResponseErrorData> {
  constructor(code: number, message: string, data: NotifyResponseErrorData) {
    super(code, message, data);
  }
}

export class MissingModuleException extends NotifyResponseError {
  constructor(moduleName: string, moduleVersion: string = 'latest', conn: ConnectionInterface, mustUpgrade = false) {
    super(1000, `Missing module "${moduleName}@${moduleVersion}". Need to ${mustUpgrade ? 'upgrade' : 'install'}.`, {
      notification: MissingModuleNotification,
      dontNotify: true,
      args: {
        conn,
        moduleName,
        moduleVersion,
        action: mustUpgrade ? 'upgrade' : 'install'
      }
    });
  }
}

export default MissingModuleException;
