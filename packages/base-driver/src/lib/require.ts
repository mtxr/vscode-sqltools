import logger from './log';
import envPaths from 'env-paths';
import path from 'path';
import fs from 'fs';
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

const _require: NodeRequire = global.__non_webpack_require__ || require;
function _sqltoolsRequire(id) {
  log(`Require module ${getDataPath('node_modules', id)}`)
  return _require(getDataPath('node_modules', id));
}
function _sqltoolsResolve (id, options) {
  log(`Resolve module ${getDataPath('node_modules', id)}`)
  return _require.resolve(getDataPath('node_modules', id), options)
}

_sqltoolsResolve.paths = _require.resolve.paths as RequireResolve['paths'];
_sqltoolsRequire.resolve = _sqltoolsResolve as RequireResolve;
_sqltoolsRequire.cache = _require.cache;
_sqltoolsRequire.extensions = _require.extensions;
_sqltoolsRequire.main = _require.main;
_sqltoolsRequire.requireActual = _require.requireActual;
_sqltoolsRequire.requireMock = _require.requireMock;
_sqltoolsRequire.ensure = (_require as any).ensure;
_sqltoolsRequire.include = (_require as any).include;
_sqltoolsRequire.context = (_require as any).context;
_sqltoolsRequire.resolveWeak = (_require as any).resolveWeak;

const sqltoolsRequire: NodeRequire = _sqltoolsRequire;

export default sqltoolsRequire;