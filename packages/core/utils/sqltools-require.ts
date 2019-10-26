import { getDataPath } from './persistence';

function _sqltoolsRequire(id) {
  return __non_webpack_require__(getDataPath('node_modules', id));
}
function _sqltoolsResolve (id, options) {
  return __non_webpack_require__.resolve(getDataPath('node_modules', id), options)
}

_sqltoolsResolve.paths = __non_webpack_require__.resolve.paths;
_sqltoolsRequire.resolve = _sqltoolsResolve;
_sqltoolsRequire.cache = __non_webpack_require__.cache;
_sqltoolsRequire.extensions = __non_webpack_require__.extensions;
_sqltoolsRequire.main = __non_webpack_require__.main;
_sqltoolsRequire.requireActual = __non_webpack_require__.requireActual;
_sqltoolsRequire.ensure = __non_webpack_require__.ensure;
_sqltoolsRequire.include = __non_webpack_require__.include;
_sqltoolsRequire.context = __non_webpack_require__.context;
_sqltoolsRequire.requireMock = __non_webpack_require__.requireMock;
_sqltoolsRequire.resolveWeak = __non_webpack_require__.resolveWeak;

const sqltoolsRequire: NodeRequire = _sqltoolsRequire;

export default sqltoolsRequire;