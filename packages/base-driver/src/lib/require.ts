import envPaths from 'env-paths';
import path from 'path';
import fs from 'fs';
import { sync } from 'resolve';
import * as mkdir from 'make-dir';

const SQLTOOLS_PATHS = envPaths(`vscode-${process.env.EXT_NAMESPACE || 'sqltools'}`, { suffix: null });

if (!fs.existsSync(SQLTOOLS_PATHS.data)) {
  mkdir.sync(SQLTOOLS_PATHS.data);
}

if (!fs.existsSync(getDataPath('node_modules'))) {
  mkdir.sync(getDataPath('node_modules'));
}

function getDataPath(...args: string[]) {
  return path.resolve(SQLTOOLS_PATHS.data, ...args);
}

export const sqltoolsResolve = (name: string) => sync(name, { basedir: getDataPath() })
const sqltoolsRequire = (name: string) => require(sqltoolsResolve(name));
export default sqltoolsRequire;