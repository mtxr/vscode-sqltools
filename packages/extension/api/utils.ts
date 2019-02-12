import { VERSION } from '@sqltools/core/constants';
import { read as readLocalConfig, write as writeLocalConfig } from '@sqltools/core/utils/persistence';

let localSetupData: any;

namespace Utils {
  /**
   * Format SQLQuery
   *
   * @throws {EnvironmentException} Can't find user path from wnv
   * @returns {string} Returns user path as string
   */
  export async function getlastRunInfo() {
    if (localSetupData) {
      return localSetupData;
    }
    const localConfig = {
      current: {
        numericVersion: numericVersion(VERSION),
        releaseNotes: `https://github.com/mtxr/vscode-sqltools/blob/master/CHANGELOG.md#v${VERSION.replace(/\./g, '')}`,
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
      localConfig.onDisk = readLocalConfig();
      localConfig.current.updated = localConfig.current.numericVersion > localConfig.onDisk.numericVersion;
      localConfig.current.lastNotificationDate = localConfig.onDisk.lastNotificationDate || 0;
    } catch (e) { /**/ }

    localSetupData = localConfig;
    writeLocalConfig(localConfig.current);

    return localConfig;
  }

  export async function updateLastRunInfo(props = {}) {
    try {
      const lastRun = await getlastRunInfo();
      lastRun.current = Object.assign({}, lastRun.current || {}, props);
      localSetupData = lastRun;

      await writeLocalConfig(lastRun.current);
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
