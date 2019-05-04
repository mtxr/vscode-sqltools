import { ElectronNotSupportedNotification } from '@sqltools/plugins/dependency-manager/contracts';
import { ResponseError } from 'vscode-languageserver';


interface NotifyResponseErrorData {
  notification: string; dontNotify?: boolean; args?: any
};
class NotifyResponseError extends ResponseError<NotifyResponseErrorData> {
  constructor(code: number, message: string, data: NotifyResponseErrorData) {
    super(code, message, data);
  }
}

export class ElectronNotSupportedException extends NotifyResponseError {
  constructor(message: string = 'Electron is not supported. You should enable \'sqltools.useNodeRuntime\' and have NodeJS installed to continue.') {
    super(1001, message, {
      notification: ElectronNotSupportedNotification,
      dontNotify: true
    });
  }
}

export default ElectronNotSupportedException;
