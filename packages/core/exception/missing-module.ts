import { MissingModuleNotification } from '@sqltools/plugins/dependency-manager/contracts';
import { IConnection, NodeDependency } from '@sqltools/types';
import NotifyResponseError from './response-error';

export class MissingModuleError extends NotifyResponseError {
  constructor(deps: NodeDependency[], conn: IConnection, mustUpgrade = false) {
    super(1000, `Missing module "${deps.map((d, i) => `${d.name}@${d.version || 'latest'}${i === deps.length - 2 ? ' and ' : (i === deps.length - 1 ? '' : ', ')}`).join('')}". Need to ${mustUpgrade ? 'upgrade' : 'install'}.`, {
      notification: MissingModuleNotification,
      dontNotify: true,
      args: {
        conn,
        action: mustUpgrade ? 'upgrade' : 'install',
        deps,
      }
    });
  }
}

export default MissingModuleError;
