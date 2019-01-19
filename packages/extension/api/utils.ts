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
        // tslint:disable-next-line:max-line-length
        releaseNotes: `https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/${VERSION.replace(/\.([\da-z\-_]+)$/, '.x')}.md`,
        run: new Date().getTime(),
        updated: false,
        version: VERSION,
      },
      installed: {
        numericVersion: 0,
        run: 0,
        version: '',
      },
    };
    try {
      localConfig.installed = readLocalConfig();
      localConfig.current.updated = localConfig.current.numericVersion > localConfig.installed.numericVersion;
    } catch (e) { /**/ }

    localSetupData = localConfig;
    writeLocalConfig(localConfig.current);

    return localConfig;
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
