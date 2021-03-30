import NotifyResponseError from '@sqltools/base-driver/dist/lib/exception/response-error';
import { DriverNotInstalledNotification } from '../notifications';
import { DatabaseDriver } from '@sqltools/types';

export class DriverNotInstalledError extends NotifyResponseError {
  constructor(driverName: DatabaseDriver) {
    super(1000, `Driver ${driverName} not installed.`, {
      notification: DriverNotInstalledNotification,
      dontNotify: true,
      args: {
        driverName,
      },
    });
  }
}

export default DriverNotInstalledError;
