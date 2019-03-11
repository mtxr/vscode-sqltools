import path from 'path';
import { VERSION } from '@sqltools/core/constants';
import SerializableStorage from '@sqltools/core/utils/serializable-storage';
import { getHome } from '@sqltools/core/utils/get-home';

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
    setup = new SerializableStorage<any, string>(path.join(getHome(), '.sqltools-setup'));
    const localConfig = {
      current: {
        numericVersion: numericVersion(VERSION),
        releaseNotes: `https://mtxr.gitbook.io/vscode-sqltools/changelog#v-${VERSION.replace(/\./g, '-')}`,
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

  export function numericVersion(v: string) {
    const n: number[] = v.replace(/^v/, '').split('.')
      .map((a) => parseInt(a.replace(/\D+/, ''), 10));
    if (n.length >= 3) return n[0] * 10000 + n[1] * 100 + n[2];
    if (n.length === 2) return n[0] * 10000 + n[1] * 100;
    return n[0] * 10000;
  }
}

export default Utils;
