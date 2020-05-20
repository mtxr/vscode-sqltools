import { VERSION, DOCS_ROOT_URL } from '@sqltools/util/constants';
import SerializableStorage from '@sqltools/util/persistence/serializable-storage';
import { numericVersion } from '@sqltools/util/text';
import { getConfigPath, RUNNING_INFO_FILENAME } from '@sqltools/util/path';

let setup: SerializableStorage<any, string>;

interface ILocalRunInfo {
  numericVersion:       number;
  releaseNotes:         string;
  run:                  number;
  updated:              boolean;
  version:              string;
  lastNotificationDate: number;
  installedExtPlugins:  { [type: string]: string[] };
}

namespace Utils {
  /**
   * Format SQLQuery
   *
   * @throws {EnvironmentException} Can't find user path from wnv
   * @returns {string} Returns user path as string
   */
  export function getlastRunInfo(): ILocalRunInfo {
    if (setup) {
      return setup.getContent();
    }
    setup = new SerializableStorage<any, string>(getConfigPath(RUNNING_INFO_FILENAME));
    const localConfig = {
      current: <ILocalRunInfo>{
        numericVersion: numericVersion(VERSION),
        releaseNotes: `${DOCS_ROOT_URL}/changelog#v-${VERSION.replace(/\./g, '-')}`,
        run: new Date().getTime(),
        updated: false,
        version: VERSION,
        lastNotificationDate: 0,
        installedExtPlugins: {}
      },
      onDisk: <ILocalRunInfo>{
        numericVersion: 0,
        run: 0,
        version: '',
        lastNotificationDate: 0,
        installedExtPlugins: {}
      },
    };
    try {
      localConfig.onDisk = setup.getContent();
      localConfig.current.installedExtPlugins = localConfig.onDisk.installedExtPlugins;
      localConfig.current.updated = localConfig.current.numericVersion > localConfig.onDisk.numericVersion;
      localConfig.current.lastNotificationDate = localConfig.onDisk.lastNotificationDate || 0;
    } catch (e) { /**/ }

    setup.content(localConfig.current).save();

    return localConfig.current;
  }

  export function updateLastRunInfo(propsUpdater: Partial<ILocalRunInfo>) {
    if (!propsUpdater) return;
    try {
      const pastProps = getlastRunInfo();
      setup.content(<ILocalRunInfo>{
        ...(pastProps || {}),
        ...propsUpdater,
        installedExtPlugins: {
          ...(pastProps.installedExtPlugins || {}),
          ...(propsUpdater.installedExtPlugins || {}),
        }
      }).save();
    } catch (e) { /**/ }
  }
}

export default Utils;
