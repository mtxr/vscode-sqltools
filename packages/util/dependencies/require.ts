import { getDataPath } from '@sqltools/util/path';
import logger from '@sqltools/util/log';

const log = logger.extend('sqltools-require:debug');

const _require: NodeRequire = __non_webpack_require__ || require;
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