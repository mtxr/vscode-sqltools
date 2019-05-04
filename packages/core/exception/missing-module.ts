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
  constructor(moduleName: string, moduleVersion: string = 'latest', conn: ConnectionInterface) {
    super(1000, `Missing module "${moduleName}@${moduleVersion}". Need to install and compile.`, {
      notification: MissingModuleNotification,
      dontNotify: true,
      args: {
        conn,
        moduleName,
        moduleVersion,
      }
    });
  }
}

export default MissingModuleException;
