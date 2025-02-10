"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const readFile = fp => new Promise((resolve, reject) => {
  _fs.default.readFile(fp, 'utf8', (err, data) => {
    if (err) return reject(err);
    resolve(data);
  });
});

const readFileSync = fp => {
  return _fs.default.readFileSync(fp, 'utf8');
};

const pathExists = fp => new Promise(resolve => {
  _fs.default.access(fp, err => {
    resolve(!err);
  });
});

const pathExistsSync = _fs.default.existsSync;

class JoyCon {
  constructor({
    files,
    cwd = process.cwd(),
    stopDir,
    packageKey,
    parseJSON = JSON.parse
  } = {}) {
    this.options = {
      files,
      cwd,
      stopDir,
      packageKey,
      parseJSON
    };
    this.existsCache = new Map();
    this.loaders = new Set();
    this.packageJsonCache = new Map();
  }

  addLoader(loader) {
    this.loaders.add(loader);
    return this;
  }

  removeLoader(name) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.loaders[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const loader = _step.value;

        if (name && loader.name === name) {
          this.loaders.delete(loader);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return this;
  }

  recusivelyResolve(options) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (options.cwd === options.stopDir || _path.default.basename(options.cwd) === 'node_modules') {
        return null;
      }

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = options.files[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          const filename = _step4.value;

          const file = _path.default.resolve(options.cwd, filename);

          const exists = process.env.NODE_ENV !== 'test' && _this.existsCache.has(file) ? _this.existsCache.get(file) : yield pathExists(file);

          _this.existsCache.set(file, exists);

          if (exists) {
            if (!options.packageKey || _path.default.basename(file) !== 'package.json') {
              return file;
            }

            const data = require(file);

            delete require.cache[file];
            const hasPackageKey = Object.prototype.hasOwnProperty.call(data, options.packageKey);

            if (hasPackageKey) {
              _this.packageJsonCache.set(file, data);

              return file;
            }
          }

          continue;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return _this.recusivelyResolve(Object.assign({}, options, {
        cwd: _path.default.dirname(options.cwd)
      }));
    })();
  }

  recusivelyResolveSync(options) {
    if (options.cwd === options.stopDir || _path.default.basename(options.cwd) === 'node_modules') {
      return null;
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = options.files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        const filename = _step2.value;

        const file = _path.default.resolve(options.cwd, filename);

        const exists = process.env.NODE_ENV !== 'test' && this.existsCache.has(file) ? this.existsCache.get(file) : pathExistsSync(file);
        this.existsCache.set(file, exists);

        if (exists) {
          if (!options.packageKey || _path.default.basename(file) !== 'package.json') {
            return file;
          }

          const data = require(file);

          delete require.cache[file];
          const hasPackageKey = Object.prototype.hasOwnProperty.call(data, options.packageKey);

          if (hasPackageKey) {
            this.packageJsonCache.set(file, data);
            return file;
          }
        }

        continue;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return this.recusivelyResolveSync(Object.assign({}, options, {
      cwd: _path.default.dirname(options.cwd)
    }));
  }

  resolve(...args) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const options = _this2.normalizeOptions(args);

      return _this2.recusivelyResolve(options);
    })();
  }

  resolveSync(...args) {
    const options = this.normalizeOptions(args);
    return this.recusivelyResolveSync(options);
  }

  load(...args) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const options = _this3.normalizeOptions(args);

      const filepath = yield _this3.recusivelyResolve(options);

      if (filepath) {
        const loader = _this3.findLoader(filepath);

        if (loader) {
          return {
            path: filepath,
            data: yield loader.load(filepath)
          };
        }

        const extname = _path.default.extname(filepath).slice(1);

        if (extname === 'js') {
          delete require.cache[filepath];
          return {
            path: filepath,
            data: require(filepath)
          };
        }

        if (extname === 'json') {
          if (_this3.packageJsonCache.has(filepath)) {
            return {
              path: filepath,
              data: _this3.packageJsonCache.get(filepath)[options.packageKey]
            };
          }

          const data = _this3.options.parseJSON((yield readFile(filepath)));

          return {
            path: filepath,
            data
          };
        }

        return {
          path: filepath,
          data: yield readFile(filepath)
        };
      }

      return {};
    })();
  }

  loadSync(...args) {
    const options = this.normalizeOptions(args);
    const filepath = this.recusivelyResolveSync(options);

    if (filepath) {
      const loader = this.findLoader(filepath);

      if (loader) {
        return {
          path: filepath,
          data: loader.loadSync(filepath)
        };
      }

      const extname = _path.default.extname(filepath).slice(1);

      if (extname === 'js') {
        delete require.cache[filepath];
        return {
          path: filepath,
          data: require(filepath)
        };
      }

      if (extname === 'json') {
        if (this.packageJsonCache.has(filepath)) {
          return {
            path: filepath,
            data: this.packageJsonCache.get(filepath)[options.packageKey]
          };
        }

        const data = this.options.parseJSON(readFileSync(filepath));
        return {
          path: filepath,
          data
        };
      }

      return {
        path: filepath,
        data: readFileSync(filepath)
      };
    }

    return {};
  }

  findLoader(filepath) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this.loaders[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        const loader = _step3.value;

        if (loader.test && loader.test.test(filepath)) {
          return loader;
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return null;
  }

  clearCache() {
    this.existsCache.clear();
    this.packageJsonCache.clear();
    return this;
  }

  normalizeOptions(args) {
    const options = Object.assign({}, this.options);

    if (Object.prototype.toString.call(args[0]) === '[object Object]') {
      Object.assign(options, args[0]);
    } else {
      if (args[0]) {
        options.files = args[0];
      }

      if (args[1]) {
        options.cwd = args[1];
      }

      if (args[2]) {
        options.stopDir = args[2];
      }
    }

    options.cwd = _path.default.resolve(options.cwd);
    options.stopDir = options.stopDir ? _path.default.resolve(options.stopDir) : _path.default.parse(options.cwd).root;

    if (!options.files || options.files.length === 0) {
      throw new Error('[joycon] files must be an non-empty array!');
    }

    options.__normalized__ = true;
    return options;
  }

}

exports.default = JoyCon;
module.exports = JoyCon;
module.exports.default = JoyCon;