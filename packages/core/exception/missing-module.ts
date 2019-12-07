import { MissingModuleNotification } from '@sqltools/plugins/dependency-manager/contracts';
import { IConnection } from '@sqltools/types';
import NotifyResponseError from './response-error';


export class MissingModuleError extends NotifyResponseError {
  constructor(moduleName: string, moduleVersion: string = 'latest', conn: IConnection, mustUpgrade = false) {
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

export default MissingModuleError;
