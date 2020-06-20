import logger from './log';
import envPaths from 'env-paths';
import path from 'path';
import fs from 'fs';
import { sync } from 'resolve';
import * as mkdir from 'make-dir';

const log = logger.extend('require');
const SQLTOOLS_PATHS = envPaths(`vscode-${process.env.EXT_NAMESPACE || 'sqltools'}`, { suffix: null });

if (!fs.existsSync(SQLTOOLS_PATHS.data)) {
  mkdir.sync(SQLTOOLS_PATHS.data);
  log.extend('debug')(`Created data path ${SQLTOOLS_PATHS.data}`);
}

if (!fs.existsSync(getDataPath('node_modules'))) {
  mkdir.sync(getDataPath('node_modules'));
  log.extend('debug')(`Created node_modules path ${getDataPath('node_modules')}`);
}

function getDataPath(...args: string[]) {
  return path.resolve(SQLTOOLS_PATHS.data, ...args);
}

export const sqltoolsResolve = (name: string) => sync(name, { basedir: getDataPath() })
const sqltoolsRequire = (name: string) => require(sqltoolsResolve(name));
export default sqltoolsRequire;