import { VERSION, DOCS_ROOT_URL } from '@sqltools/core/constants';
import SerializableStorage from '@sqltools/core/utils/serializable-storage';
import { numericVersion } from '@sqltools/core/utils';
import { getConfigPath, RUNNING_INFO_FILENAME } from '@sqltools/core/utils/persistence';

let setup: SerializableStorage<any, string>;

namespace Utils {
  /**
   * Format SQLQuery
   *
   * @throws {EnvironmentException} Can't find user path from wnv
   * @returns {string} Returns user path as string
   */
  export function getlastRunInfo() {
    if (setup) {
      return setup.getContent();
    }
    setup = new SerializableStorage<any, string>(getConfigPath(RUNNING_INFO_FILENAME));
    const localConfig = {
      current: {
        numericVersion: numericVersion(VERSION),
        releaseNotes: `${DOCS_ROOT_URL}/changelog#v-${VERSION.replace(/\./g, '-')}`,
        run: new Date().getTime(),
        updated: false,
        version: VERSION,
        lastNotificationDate: 0,
      },
      onDisk: {
        numericVersion: 0,
        run: 0,
        version: '',
        lastNotificationDate: 0,
      },
    };
    try {
      localConfig.onDisk = setup.getContent();
      localConfig.current.updated = localConfig.current.numericVersion > localConfig.onDisk.numericVersion;
      localConfig.current.lastNotificationDate = localConfig.onDisk.lastNotificationDate || 0;
    } catch (e) { /**/ }

    setup.content(localConfig.current).save();

    return localConfig.current;
  }

  export function updateLastRunInfo(props = {}) {
    try {
      const current = Object.assign({}, getlastRunInfo() || {}, props);
      setup.content(current).save();
    } catch (e) { /**/ }
  }
}

export default Utils;
